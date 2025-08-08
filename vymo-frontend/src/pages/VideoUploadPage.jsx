import { useState, useRef } from "react";
import axios from "axios";
// === BARU: Impor untuk Chart.js ===
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

// === BARU: Registrasi komponen Chart.js ===
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
  const [mainEmotion, setMainEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzedVideoUrl, setAnalyzedVideoUrl] = useState(null);
  const videoRef = useRef(null);

  // === BARU: State untuk data timeline grafik ===
  const [timelineData, setTimelineData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Reset semua hasil analisis sebelumnya
      setMainEmotion(null);
      setAnalyzedVideoUrl(null);
      setTimelineData(null);
    }
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", videoFile);

      const response = await axios.post(
        "http://localhost:8000/analyze/video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Simpan URL video dan emosi utama
      const videoUrl = `http://localhost:8000${response.data.analyzed_video_url}`;
      setAnalyzedVideoUrl(videoUrl);

      const mainEmotions = response.data.main_emotions || {};
      if (Object.keys(mainEmotions).length > 0) {
        const sorted = Object.entries(mainEmotions).sort((a, b) => b[1] - a[1]);
        const [topEmotion, topValue] = sorted[0];
        setMainEmotion({
          emotion: topEmotion,
          percentage: (topValue * 100).toFixed(2),
        });
      }

      // === BARU: Simpan data timeline ===
      if (response.data.emotion_timeline) {
        setTimelineData(response.data.emotion_timeline);
      }
    } catch (error) {
      console.error("Error analyzing video:", error);
      // Anda bisa menambahkan state untuk menampilkan pesan error di UI
    } finally {
      setLoading(false);
    }
  };

  // === BARU: Fungsi untuk menyiapkan data untuk grafik ===
  const prepareChartData = () => {
    if (!timelineData) return null;

    const labels = timelineData.map((data) => data.timestamp.toFixed(1) + "s");
    const emotions = Object.keys(timelineData[0].emotions);

    const emotionColors = {
      happy: "rgba(255, 206, 86, 1)",
      sad: "rgba(54, 162, 235, 1)",
      angry: "rgba(255, 99, 132, 1)",
      neutral: "rgba(201, 203, 207, 1)",
      fear: "rgba(153, 102, 255, 1)",
      disgust: "rgba(75, 192, 192, 1)",
      surprise: "rgba(255, 159, 64, 1)",
    };

    const datasets = emotions.map((emotion) => ({
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      data: timelineData.map((data) => data.emotions[emotion]),
      borderColor: emotionColors[emotion] || "rgba(0, 0, 0, 1)",
      backgroundColor: (emotionColors[emotion] || "rgba(0,0,0,1)").replace(
        "1)",
        "0.5)"
      ),
      fill: false,
      tension: 0.1,
    }));

    return { labels, datasets };
  };

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-purple-200 text-center pt-24">
        Upload Video untuk Deteksi Emosi
      </h1>

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
                     hover:file:bg-purple-700"
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
          {loading ? "Menganalisis..." : "Analisis Video"}
        </button>
      )}

      {/* === MODIFIKASI: Pindahkan hasil ke dalam satu kontainer === */}
      <div className="w-full max-w-4xl space-y-12">
        {mainEmotion && (
          <div className="text-center bg-purple-900/50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-purple-200">
              Emosi Dominan Keseluruhan:
            </h2>
            <p className="text-4xl font-bold capitalize mt-2">
              {mainEmotion.emotion}
              <span className="text-2xl font-medium ml-2 text-purple-300">
                ({mainEmotion.percentage}%)
              </span>
            </p>
          </div>
        )}

        {analyzedVideoUrl && (
          <div className="w-full">
            <h3 className="text-xl font-semibold text-purple-200 mb-4 text-center">
              Hasil Video dengan Anotasi
            </h3>
            <video
              className="w-full rounded-xl shadow-lg"
              controls
              src={analyzedVideoUrl}
              type="video/mp4"
            >
              Your browser does not support the video tag.
            </video>

            <div className="text-center mt-4">
              <a
                href={analyzedVideoUrl}
                download
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300"
              >
                Download Video Hasil
              </a>
            </div>
          </div>
        )}

        {/* === BARU: Tampilkan grafik jika data tersedia === */}
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
    </div>
  );
}
