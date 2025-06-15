import cv2
import numpy as np
from keras.models import load_model

class EmotionRecognizer:
    def __init__(self, model_path='models/emotion_model.h5'):  # sesuai nama model hasil training
        self.model = load_model(model_path, compile=False)
        self.labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']  # urutan label sesuai training

    def predict_emotion(self, face_img):
        face_img = cv2.resize(face_img, (64, 64))  # ukuran sesuai saat training
        face_img = face_img.astype('float32') / 255.0
        face_img = np.expand_dims(face_img, axis=0)
        face_img = np.expand_dims(face_img, axis=-1)  # channel grayscale (1)
        preds = self.model.predict(face_img)[0]
        return dict(zip(self.labels, preds))
