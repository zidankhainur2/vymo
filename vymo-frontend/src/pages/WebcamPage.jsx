import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function WebcamPage() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotionResults, setEmotionResults] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);

  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsDetecting(true);

    try {
      const blob = await (await fetch(imageSrc)).blob();
      const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/analyze/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setEmotionResults(response.data.results || []);
    } catch (error) {
      console.error("Error analyzing:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    const drawOverlay = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const video = webcamRef.current?.video;

      if (canvas && context && video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);

        emotionResults.forEach((res, index) => {
          const [x, y, w, h] = res.box;
          context.strokeStyle = "#A78BFA"; // Ungu
          context.lineWidth = 2;
          context.strokeRect(x, y, w, h);

          const emotionText = Object.entries(res.emotions)
            .map(
              ([emotion, score]) => `${emotion}: ${(score * 100).toFixed(1)}%`
            )
            .join(" | ");

          context.fillStyle = "#A78BFA";
          context.font = "16px sans-serif";
          context.fillText(`Wajah ${index + 1}: ${emotionText}`, x, y - 10);
        });
      }

      requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
  }, [emotionResults]);

  useEffect(() => {
    if (!autoDetect) return;

    const interval = setInterval(() => {
      if (!isDetecting) {
        captureAndAnalyze();
      }
    }, 500); //set time 0,5 detik

    return () => clearInterval(interval);
  }, [autoDetect, isDetecting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex flex-col items-center justify-center text-white px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-purple-200 text-center">
        Deteksi Emosi Wajah
      </h1>

      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-700">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-2xl"
          videoConstraints={{ facingMode: "user" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={captureAndAnalyze}
          disabled={isDetecting}
          className={`px-6 py-3 rounded-full transition duration-300 shadow-md font-medium ${
            isDetecting
              ? "bg-purple-500 cursor-not-allowed opacity-70"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isDetecting ? "Menganalisis..." : "Ambil Sekali"}
        </button>

        <button
          onClick={() => setAutoDetect((prev) => !prev)}
          className={`px-6 py-3 rounded-full transition duration-300 font-medium shadow-md ${
            autoDetect
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {autoDetect ? "Matikan Auto" : "Aktifkan Auto"}
        </button>
      </div>
    </div>
  );
}
