# main.py
from fastapi import FastAPI, File, UploadFile, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uuid
import numpy as np
import cv2
import tempfile
import os
from datetime import datetime
import base64

from emotion_model import EmotionRecognizer
from face_detector import detect_faces
from utils import preprocess_face

# --- 1. Definisi Model Pydantic (Skema Data) ---

class EmotionPrediction(BaseModel):
    emotions: Dict[str, float] = Field(..., example={"Happy": 0.99, "Neutral": 0.01})
    box: List[int] = Field(..., example=[100, 150, 50, 50])

class ImageAnalysisResponse(BaseModel):
    results: List[EmotionPrediction]

class ImageComparisonResponse(BaseModel):
    results_image1: List[EmotionPrediction]
    results_image2: List[EmotionPrediction]

class VideoAnalysisResult(BaseModel):
    main_emotions: Dict[str, float]
    analyzed_video_url: str
    emotion_timeline: List[Dict]

class JobStatusResponse(BaseModel):
    status: str = Field(..., example="completed")
    result: Optional[VideoAnalysisResult] = None
    error: Optional[str] = None

class JobCreationResponse(BaseModel):
    job_id: str = Field(..., example=str(uuid.uuid4()))
    message: str = Field(..., example="Video analysis started.")

class Base64ImageRequest(BaseModel):
    image_base64: str

# --- 2. Inisialisasi Aplikasi dan Konfigurasi ---

app = FastAPI(
    title="VYMO Emotion Recognition API",
    description="API untuk mendeteksi emosi wajah dari gambar dan video.",
    version="1.0.0"
)

# Muat model sekali saat aplikasi dimulai
model = EmotionRecognizer(model_path="models/emotion_model.h5")

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Konfigurasi direktori untuk video hasil analisis
OUTPUT_DIR = "annotated_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)
app.mount("/videos", StaticFiles(directory=OUTPUT_DIR), name="videos")

# Penyimpanan status job (dalam memori, untuk tujuan demo)
video_analysis_jobs: Dict[str, Dict] = {}


# --- 3. Fungsi Helper dan Logika Inti ---

def _analyze_single_image(contents: bytes) -> List[EmotionPrediction]:
    """Menganalisis konten byte gambar dan mengembalikan list objek EmotionPrediction."""
    npimg = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image format")

    faces = detect_faces(img) # Menggunakan DNN detector yang lebih baik
    
    results = []
    if len(faces) > 0:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        for (x, y, w, h) in faces:
            face = preprocess_face(gray, x, y, w, h)
            emotions = model.predict_emotion(face)
            sorted_emotions = dict(sorted(emotions.items(), key=lambda item: item[1], reverse=True))
            results.append(EmotionPrediction(
                box=[int(x), int(y), int(w), int(h)],
                emotions={k: float(f"{v:.4f}") for k, v in sorted_emotions.items()}
            ))
    return results

def process_video_in_background(file_contents: bytes, job_id: str):
    """Fungsi ini berjalan di background untuk analisis video."""
    temp_video_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            temp_video_path = temp_video.name
            temp_video.write(file_contents)

        cap = cv2.VideoCapture(temp_video_path)
        if not cap.isOpened():
            raise Exception("Cannot open video file")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"annotated_{job_id}_{timestamp}.mp4"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        emotion_counter = {label: 0 for label in model.labels}
        emotion_timeline = []
        frame_index = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            
            frame_index += 1
            faces = detect_faces(frame)
            
            num_faces_in_frame = len(faces)
            frame_emotion_sum = {label: 0.0 for label in model.labels}

            for (x, y, w, h) in faces:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                face = preprocess_face(gray, x, y, w, h)
                emotions = model.predict_emotion(face)
                top_emotion = max(emotions, key=emotions.get)
                emotion_counter[top_emotion] += 1
                
                for emotion, score in emotions.items():
                    frame_emotion_sum[emotion] += score
                
                cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 255), 2)
                label = f"{top_emotion} ({emotions[top_emotion]*100:.1f}%)"
                cv2.putText(frame, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 2)
            
            if num_faces_in_frame > 0:
                frame_emotion_avg = {emotion: total_score / num_faces_in_frame for emotion, total_score in frame_emotion_sum.items()}
                emotion_timeline.append({"frame": frame_index,"timestamp": frame_index / fps if fps > 0 else 0,"emotions": frame_emotion_avg})

            out.write(frame)

        cap.release()
        out.release()
        
        total_detected = sum(emotion_counter.values())
        if total_detected == 0:
            os.remove(output_path)
            raise Exception("No faces detected in video")
        
        main_emotions = {emotion: round(count / total_detected, 4) for emotion, count in emotion_counter.items() if count > 0}
        
        result_data = {
            "main_emotions": main_emotions,
            "analyzed_video_url": f"/videos/{output_filename}",
            "emotion_timeline": emotion_timeline
        }
        video_analysis_jobs[job_id] = {"status": "completed", "result": result_data, "error": None}

    except Exception as e:
        video_analysis_jobs[job_id] = {"status": "failed", "error": str(e), "result": None}
    finally:
        if temp_video_path and os.path.exists(temp_video_path):
            os.remove(temp_video_path)


# --- 4. Definisi Endpoint API ---

@app.get("/", summary="Endpoint Root", include_in_schema=False)
def read_root():
    return {"message": "Welcome to VYMO Emotion Recognition API"}

@app.post("/analyze/image", response_model=ImageAnalysisResponse, summary="Analisis Satu Gambar")
async def analyze_image(file: UploadFile = File(...)):
    """Menganalisis emosi dari satu file gambar yang diunggah."""
    try:
        contents = await file.read()
        analysis_results = _analyze_single_image(contents)
        return ImageAnalysisResponse(results=analysis_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image_base64", response_model=ImageAnalysisResponse, summary="Analisis Gambar Base64")
async def analyze_image_base64(request: Base64ImageRequest):
    """Menganalisis emosi dari snapshot webcam (format base64)."""
    try:
        img_data = base64.b64decode(request.image_base64.split(",", 1)[-1])
        analysis_results = _analyze_single_image(img_data)
        return ImageAnalysisResponse(results=analysis_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/image-comparison", response_model=ImageComparisonResponse, summary="Bandingkan Dua Gambar")
async def analyze_image_comparison(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """Menganalisis dan membandingkan emosi dari dua file gambar."""
    try:
        contents1 = await file1.read()
        contents2 = await file2.read()
        results1 = _analyze_single_image(contents1)
        results2 = _analyze_single_image(contents2)
        return ImageComparisonResponse(results_image1=results1, results_image2=results2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/video", response_model=JobCreationResponse, summary="Mulai Analisis Video")
async def start_video_analysis(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Menerima video dan memulai proses analisis di latar belakang."""
    job_id = str(uuid.uuid4())
    file_contents = await file.read()
    
    # PERBAIKAN: Catat job SEBELUM memulai task untuk mencegah race condition
    video_analysis_jobs[job_id] = {"status": "processing", "result": None, "error": None}
    
    background_tasks.add_task(process_video_in_background, file_contents, job_id)
    
    return JobCreationResponse(job_id=job_id, message="Video analysis started.")

@app.get("/analyze/video/status/{job_id}", response_model=JobStatusResponse, summary="Cek Status Analisis Video")
async def get_video_analysis_status(job_id: str):
    """Memeriksa status pekerjaan analisis video yang sedang berjalan."""
    job = video_analysis_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobStatusResponse(**job)