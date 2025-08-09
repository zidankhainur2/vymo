import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function VideoUploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [jobId, setJobId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const pollingIntervalRef = useRef(null);
  const videoRef = useRef(null); // Tambahkan ref untuk video preview

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setLoading(false);
      setJobId(null);
      setStatusMessage("");
      setError(null);
      setAnalysisResult(null);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;
    setLoading(true);
    setStatusMessage("Mengunggah video...");
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", videoFile);

      const response = await axios.post(
        "http://localhost:8000/analyze/video",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.job_id) {
        setJobId(response.data.job_id);
        setStatusMessage("Video diterima, analisis dimulai...");
      }
    } catch (err) {
      console.error("Error starting analysis:", err);
      setError("Gagal memulai analisis. Silakan coba lagi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const pollStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/analyze/video/status/${jobId}`
        );
        const { status, result, error: jobError } = response.data;

        if (status === "completed") {
          clearInterval(pollingIntervalRef.current);
          setAnalysisResult(result);
          setStatusMessage("Analisis berhasil diselesaikan!");
          setLoading(false);
          setJobId(null);
        } else if (status === "failed") {
          clearInterval(pollingIntervalRef.current);
          setError(jobError || "Terjadi kesalahan saat analisis video.");
          setLoading(false);
          setJobId(null);
        } else {
          setStatusMessage("Analisis sedang berjalan, mohon tunggu...");
        }
      } catch (err) {
        console.error("Error polling status:", err);
        setError("Gagal memeriksa status analisis.");
        clearInterval(pollingIntervalRef.current);
        setLoading(false);
        setJobId(null);
      }
    };

    pollingIntervalRef.current = setInterval(pollStatus, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [jobId]);

  const prepareChartData = () => {
    if (
      !analysisResult?.emotion_timeline ||
      analysisResult.emotion_timeline.length === 0
    )
      return null;

    const timelineData = analysisResult.emotion_timeline;
    const labels = timelineData.map((data) => data.timestamp.toFixed(1) + "s");
    const emotions = Object.keys(timelineData[0].emotions);

    const emotionColors = {
      Happy: "rgba(255, 206, 86, 1)",
      Sad: "rgba(54, 162, 235, 1)",
      Angry: "rgba(255, 99, 132, 1)",
      Neutral: "rgba(201, 203, 207, 1)",
      Fear: "rgba(153, 102, 255, 1)",
      Disgust: "rgba(75, 192, 192, 1)",
      Surprise: "rgba(255, 159, 64, 1)",
    };

    const datasets = emotions.map((emotion) => ({
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      data: timelineData.map((data) => data.emotions[emotion]),
      borderColor:
        emotionColors[emotion.charAt(0).toUpperCase() + emotion.slice(1)] ||
        "rgba(255, 255, 255, 1)",
      backgroundColor: (
        emotionColors[emotion.charAt(0).toUpperCase() + emotion.slice(1)] ||
        "rgba(255,255,255,1)"
      ).replace("1)", "0.5)"),
      fill: false,
      tension: 0.1,
    }));

    return { labels, datasets };
  };
  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white px-4 py-12 flex flex-col items-center">
      <motion.h1
        className="text-4xl font-bold mb-8 text-purple-200 text-center pt-24"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Upload Video untuk Deteksi Emosi
      </motion.h1>

      {/* --- BAGIAN YANG DIPERBAIKI --- */}
      <label className="mb-6">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-purple-600 file:text-white
                     hover:file:bg-purple-700 transition-colors"
        />
      </label>

      <div className="w-full max-w-lg h-[300px] flex items-center justify-center mb-6 border-2 border-purple-600 rounded-xl overflow-hidden shadow-lg bg-purple-950">
        {previewUrl ? (
          <video
            ref={videoRef}
            controls
            src={previewUrl}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-purple-900 animate-pulse flex items-center justify-center text-purple-300 text-sm">
            Belum ada video diunggah
          </div>
        )}
      </div>
      {/* --- AKHIR BAGIAN YANG DIPERBAIKI --- */}

      {videoFile && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-6 py-3 rounded-full font-medium shadow-md transition duration-300 mb-10 ${
            loading
              ? "bg-purple-500 cursor-not-allowed opacity-70"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Memproses..." : "Analisis Video"}
        </button>
      )}

      {/* Tampilan Status */}
      {loading && (
        <div className="mt-6 w-full max-w-lg text-center bg-white/5 p-4 rounded-lg flex items-center justify-center gap-3">
          <Loader2 className="animate-spin w-5 h-5 text-purple-300" />
          <span className="text-purple-200 font-medium">{statusMessage}</span>
        </div>
      )}
      {error && (
        <div className="mt-6 w-full max-w-lg text-center bg-red-900/50 p-4 rounded-lg flex items-center justify-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-300" />
          <span className="text-red-200 font-medium">{error}</span>
        </div>
      )}

      {/* Tampilan Hasil */}
      {analysisResult && (
        <div className="w-full max-w-4xl space-y-12 mt-10">
          <div className="text-center text-green-300 flex items-center justify-center gap-3">
            <CheckCircle />
            <p>{statusMessage}</p>
          </div>

          {analysisResult.main_emotions && (
            <div className="text-center bg-purple-900/50 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold text-purple-200">
                Emosi Dominan Keseluruhan:
              </h2>
              <p className="text-4xl font-bold capitalize mt-2">
                {Object.keys(analysisResult.main_emotions)[0]}
                <span className="text-2xl font-medium ml-2 text-purple-300">
                  (
                  {(
                    Object.values(analysisResult.main_emotions)[0] * 100
                  ).toFixed(2)}
                  %)
                </span>
              </p>
            </div>
          )}

          {analysisResult.analyzed_video_url && (
            <div className="w-full">
              <h3 className="text-xl font-semibold text-purple-200 mb-4 text-center">
                Hasil Video dengan Anotasi
              </h3>
              <video
                className="w-full rounded-xl shadow-lg"
                controls
                src={`http://localhost:8000${analysisResult.analyzed_video_url}`}
                type="video/mp4"
              >
                Browser Anda tidak mendukung tag video.
              </video>
              <div className="text-center mt-4">
                <a
                  href={`http://localhost:8000${analysisResult.analyzed_video_url}`}
                  download
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
                >
                  Download Video Hasil
                </a>
              </div>
            </div>
          )}

          {chartData && (
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Grafik Timeline Emosi
              </h3>
              <Line
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: "Perubahan Skor Emosi per Detik",
                      color: "#4A5568",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Skor Emosi",
                        color: "#4A5568",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Waktu (detik)",
                        color: "#4A5568",
                      },
                    },
                  },
                }}
                data={chartData}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
