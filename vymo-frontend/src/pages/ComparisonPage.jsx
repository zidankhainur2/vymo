import { useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";

// Komponen untuk satu slot upload
// MODIFIKASI: Prop 'imageFile' dihapus karena tidak digunakan di dalam komponen ini.
function ImageUploader({ setImageFile, previewUrl, setPreviewUrl, side }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label
        htmlFor={`file-upload-${side}`}
        className="w-full h-64 border-2 border-dashed border-purple-400 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:bg-purple-900/50 transition"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <>
            <UploadCloud className="w-12 h-12 text-purple-300" />
            <span className="mt-2 text-sm text-purple-200">
              Pilih Gambar {side}
            </span>
          </>
        )}
      </label>
      <input
        id={`file-upload-${side}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// Komponen untuk menampilkan hasil analisis
function ResultsDisplay({ results, title }) {
  if (!results) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-center text-purple-200">
        {title}
      </h3>
      {results.length === 0 ? (
        <div className="p-4 bg-white/10 rounded-lg text-center">
          <p className="text-purple-300">Tidak ada wajah terdeteksi.</p>
        </div>
      ) : (
        results.map((res, idx) => (
          <div key={idx} className="p-4 bg-white/10 rounded-lg">
            <h4 className="font-semibold text-purple-300 mb-2">
              Wajah {idx + 1}
            </h4>
            <ul className="text-sm space-y-1">
              {Object.entries(res.emotions)
                .slice(0, 3)
                .map(([emotion, score]) => (
                  <li key={emotion} className="flex justify-between">
                    <span className="capitalize">{emotion}</span>
                    <span className="font-mono bg-purple-500/50 px-2 py-0.5 rounded">
                      {(score * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default function ComparisonPage() {
  const [imageFile1, setImageFile1] = useState(null);
  const [previewUrl1, setPreviewUrl1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState(null);

  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!imageFile1 || !imageFile2) return;

    setLoading(true);
    setError(null);
    setComparisonResults(null);

    const formData = new FormData();
    formData.append("file1", imageFile1);
    formData.append("file2", imageFile2);

    try {
      const response = await axios.post(
        "http://localhost:8000/analyze/image-comparison",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setComparisonResults(response.data);
    } catch (err) {
      setError(
        "Analisis gagal. Pastikan kedua file adalah gambar yang valid dan server backend berjalan."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-200 pt-24">
            Bandingkan Emosi dari Dua Gambar
          </h1>
          <p className="text-purple-300 mt-2">
            Unggah dua gambar untuk melihat perbandingan emosi wajah secara
            berdampingan.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* MODIFIKASI: prop 'imageFile' dihapus dari sini */}
          <ImageUploader
            setImageFile={setImageFile1}
            previewUrl={previewUrl1}
            setPreviewUrl={setPreviewUrl1}
            side="Kiri"
          />
          <ImageUploader
            setImageFile={setImageFile2}
            previewUrl={previewUrl2}
            setPreviewUrl={setPreviewUrl2}
            side="Kanan"
          />
        </div>

        <div className="text-center mb-10">
          <button
            onClick={handleAnalyze}
            disabled={!imageFile1 || !imageFile2 || loading}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500/50 disabled:cursor-not-allowed rounded-full font-bold text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {loading ? "Menganalisis..." : "Bandingkan Emosi"}
          </button>
        </div>

        {/* Results Section */}
        {error && (
          <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {comparisonResults && (
          <div className="grid md:grid-cols-2 gap-8 mt-8 animate-fade-in">
            <ResultsDisplay
              results={comparisonResults.results_image1}
              title="Gambar Kiri"
            />
            <ResultsDisplay
              results={comparisonResults.results_image2}
              title="Gambar Kanan"
            />
          </div>
        )}
      </div>
    </div>
  );
}
