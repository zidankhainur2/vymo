from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime
import numpy as np
import cv2
import io
import tempfile
import os
import base64

from emotion_model import EmotionRecognizer
from face_detector import detect_faces
from utils import preprocess_face

app = FastAPI()
model = EmotionRecognizer(model_path="models/emotion_model.h5")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder hasil video dan serve static
OUTPUT_DIR = "annotated_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)
app.mount("/videos", StaticFiles(directory=OUTPUT_DIR), name="videos")


# === Helper Function untuk Menganalisis Satu Gambar ===
def _analyze_single_image(contents: bytes):
    """Menganalisis konten byte dari sebuah gambar dan mengembalikan hasilnya."""
    npimg = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        return {"error": "Invalid image format"}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detect_faces(gray)

    if not faces:
        return {"results": []}

    results = []
    for (x, y, w, h) in faces:
        face = preprocess_face(gray, x, y, w, h)
        emotions = model.predict_emotion(face)
        sorted_emotions = sorted(emotions.items(), key=lambda item: item[1], reverse=True)
        results.append({
            "box": [int(x), int(y), int(w), int(h)],
            "emotions": {k: float(f"{v:.4f}") for k, v in sorted_emotions}
        })
    return {"results": results}


# === ENDPOINTS ===

@app.get("/")
def read_root():
    return {"message": "Welcome to VYMO Emotion Recognition API"}

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    """Menganalisis emosi dari satu file gambar yang diunggah."""
    try:
        contents = await file.read()
        analysis_result = _analyze_single_image(contents)
        if "error" in analysis_result:
            return JSONResponse(status_code=400, content=analysis_result)
        if not analysis_result.get("results"):
             return {"message": "No faces detected"}
        return analysis_result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

class Base64ImageRequest(BaseModel):
    image_base64: str

@app.post("/analyze/image_base64")
async def analyze_image_base64(request: Base64ImageRequest):
    """Menganalisis emosi dari snapshot webcam base64."""
    try:
        header, encoded = request.image_base64.split(",", 1) if "," in request.image_base64 else ("", request.image_base64)
        img_data = base64.b64decode(encoded)
        analysis_result = _analyze_single_image(img_data)
        if "error" in analysis_result:
            return JSONResponse(status_code=400, content=analysis_result)
        if not analysis_result.get("results"):
             return {"message": "No faces detected"}
        return analysis_result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/analyze/image-comparison")
async def analyze_image_comparison(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    """Menganalisis dan membandingkan emosi dari dua file gambar."""
    try:
        contents1 = await file1.read()
        contents2 = await file2.read()
        results1 = _analyze_single_image(contents1)
        results2 = _analyze_single_image(contents2)
        if "error" in results1 or "error" in results2:
            return JSONResponse(status_code=400, content={"error": "One or both images are invalid."})
        return {
            "results_image1": results1.get("results", []),
            "results_image2": results2.get("results", [])
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    """Menganalisis video, membuat anotasi, dan menghasilkan timeline emosi."""
    temp_video_path = None
    try:
        temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_video_path = temp_video.name
        temp_video.write(await file.read())
        temp_video.close()
        cap = cv2.VideoCapture(temp_video_path)
        if not cap.isOpened():
            raise Exception("Cannot open video file")
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"annotated_{timestamp}.mp4"
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
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = detect_faces(gray)
            num_faces_in_frame = len(faces)
            frame_emotion_sum = {label: 0.0 for label in model.labels}
            for (x, y, w, h) in faces:
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
            return {"message": "No faces detected in video"}
        main_emotions = {emotion: round(count / total_detected, 4) for emotion, count in emotion_counter.items() if count > 0}
        return {"main_emotions": main_emotions,"analyzed_video_url": f"/videos/{output_filename}","emotion_timeline": emotion_timeline}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        if temp_video_path and os.path.exists(temp_video_path):
            os.remove(temp_video_path)

@app.get("/videos/{filename}")
async def get_annotated_video(filename: str):
    """Menyajikan video yang telah dianalisis."""
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, media_type='video/mp4', filename=filename)
    return JSONResponse(status_code=404, content={"error": "Video not found"})

@app.get("/analyze/webcam")
def analyze_webcam_snapshot():
    """Menganalisis satu frame dari webcam (untuk pengujian lokal)."""
    try:
        cap = cv2.VideoCapture(0)
        ret, frame = cap.read()
        cap.release()
        if not ret:
            return JSONResponse(status_code=500, content={"error": "Webcam capture failed"})
        contents = cv2.imencode('.jpg', frame)[1].tobytes()
        analysis_result = _analyze_single_image(contents)
        if "error" in analysis_result:
            return JSONResponse(status_code=400, content=analysis_result)
        return {"num_faces": len(analysis_result.get("results", [])), "results": analysis_result.get("results", [])}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})