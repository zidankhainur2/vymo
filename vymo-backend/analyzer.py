import cv2
import argparse
from emotion_model import EmotionRecognizer
from face_detector import detect_faces
from utils import preprocess_face, draw_emotion

def analyze_webcam(model):
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret: break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detect_faces(gray)

        for (x, y, w, h) in faces:
            face = preprocess_face(gray, x, y, w, h)
            emotions = model.predict_emotion(face)
            draw_emotion(frame, x, y, w, h, emotions)

        cv2.imshow("VYMO - Webcam Mode", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

def show_zoomable_image(image):
    # Resize the image to fit the screen at first
    scale_percent = 50  # Initial scale of 50% for showing image
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)

    resized_image = cv2.resize(image, dim, interpolation=cv2.INTER_AREA)

    cv2.imshow("Zoomable Image", resized_image)
    while True:
        # Wait for key press and take action
        key = cv2.waitKey(1) & 0xFF

        # If 'ESC' key is pressed, exit the loop
        if key == 27:  # ESC key
            break
        # Zoom in
        elif key == ord('i'):  # 'i' key for zoom in
            scale_percent += 10
            resized_image = cv2.resize(image, (int(image.shape[1] * scale_percent / 100), int(image.shape[0] * scale_percent / 100)), interpolation=cv2.INTER_AREA)
            cv2.imshow("Zoomable Image", resized_image)
        # Zoom out
        elif key == ord('o'):  # 'o' key for zoom out
            scale_percent -= 10
            resized_image = cv2.resize(image, (int(image.shape[1] * scale_percent / 100), int(image.shape[0] * scale_percent / 100)), interpolation=cv2.INTER_AREA)
            cv2.imshow("Zoomable Image", resized_image)

    cv2.destroyAllWindows()

def analyze_image(model, image_path):
    # Load and process the image
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces, etc. (Assuming you already have face detection done)
    faces = detect_faces(gray_image)  # Make sure this is your face detection function
    
    for face in faces:
        x, y, w, h = face
        face_roi = gray_image[y:y+h, x:x+w]
        emotion = model.predict_emotion(face_roi)

        # Draw bounding box and emotion label
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(image, f'{emotion}', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    # Show the zoomable image with bounding boxes and labels
    show_zoomable_image(image)

def analyze_video(model, video_path):
    cap = cv2.VideoCapture(video_path)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detect_faces(gray)

        for (x, y, w, h) in faces:
            face = preprocess_face(gray, x, y, w, h)
            emotions = model.predict_emotion(face)
            draw_emotion(frame, x, y, w, h, emotions)

        cv2.imshow("VYMO - Video Mode", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="VYMO - Face Emotion Recognition")
    parser.add_argument('--mode', choices=['webcam', 'image', 'video'], required=True, help="Mode: webcam / image / video")
    parser.add_argument('--path', help="Path to image or video file if mode is not webcam")
    args = parser.parse_args()

    model = EmotionRecognizer()

    if args.mode == 'webcam':
        analyze_webcam(model)
    elif args.mode == 'image':
        analyze_image(model, args.path)
    elif args.mode == 'video':
        analyze_video(model, args.path)
