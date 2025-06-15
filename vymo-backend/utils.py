import cv2

def preprocess_face(gray_frame, x, y, w, h):
    face = gray_frame[y:y+h, x:x+w]
    face = cv2.resize(face, (64, 64))  # disamakan dengan model
    return face

def draw_emotion(frame, x, y, w, h, emotions):
    label = sorted(emotions.items(), key=lambda x: x[1], reverse=True)
    label_str = ', '.join([f"{em} {int(prob*100)}%" for em, prob in label[:3]])  # tampilkan 3 emosi teratas
    
    cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 2)
    cv2.putText(frame, label_str, (x, y+h+20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0,255,0), 1)
