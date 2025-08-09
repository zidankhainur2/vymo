import cv2
import numpy as np
import os

# Tentukan path ke file model DNN
# Pastikan file-file ini ada di dalam direktori 'vymo-backend/models/'
proto_path = os.path.join("models", "deploy.prototxt")
model_path = os.path.join("models", "res10_300x300_ssd_iter_140000.caffemodel")

# Muat model deteksi wajah DNN dari Caffe
net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

def detect_faces(frame, confidence_threshold=0.5):
    """
    Mendeteksi wajah dalam sebuah frame gambar menggunakan model DNN.

    Args:
        frame: Frame gambar dari OpenCV.
        confidence_threshold: Ambang batas kepercayaan untuk menyaring deteksi yang lemah.

    Returns:
        List berisi kotak pembatas (bounding box) dari wajah yang terdeteksi.
        Setiap kotak direpresentasikan sebagai [x, y, w, h].
    """
    
    # Ambil dimensi frame dan buat blob dari gambar
    (h, w) = frame.shape[:2]
    # Resize gambar ke 300x300 dan normalisasi
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
        (300, 300), (104.0, 177.0, 123.0))

    # Masukkan blob ke dalam jaringan dan dapatkan hasil deteksi
    net.setInput(blob)
    detections = net.forward()

    faces = []
    # Loop melalui semua deteksi
    for i in range(0, detections.shape[2]):
        # Ambil tingkat kepercayaan (probabilitas) dari deteksi
        confidence = detections[0, 0, i, 2]

        # Saring deteksi yang lebih lemah dari ambang batas
        if confidence > confidence_threshold:
            # Hitung koordinat (x, y) dari kotak pembatas
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            # Pastikan kotak pembatas berada dalam dimensi frame
            (startX, startY) = (max(0, startX), max(0, startY))
            (endX, endY) = (min(w - 1, endX), min(h - 1, endY))

            # Hitung lebar dan tinggi kotak
            face_w = endX - startX
            face_h = endY - startY
            
            # Tambahkan hanya jika kotak valid
            if face_w > 0 and face_h > 0:
                faces.append([startX, startY, face_w, face_h])

    return faces