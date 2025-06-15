import { useState, useRef } from "react";
import axios from "axios";

export default function ImageUploadPage() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [emotionResults, setEmotionResults] = useState([]);
  const [faceCrops, setFaceCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEmotionResults([]);
      setFaceCrops([]);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setLoading(true);
    setEmotionResults([]);
    setFaceCrops([]);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(
        "http://localhost:8000/analyze/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const results = response.data.results || [];
      setEmotionResults(results);

      const img = imageRef.current;
      const waitUntilLoaded = () =>
        new Promise((resolve) => {
          if (img.complete) return resolve();
          img.onload = resolve;
        });

      await waitUntilLoaded();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const crops = results.map((res) => {
        const [x, y, w, h] = res.box;
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        return canvas.toDataURL("image/jpeg");
      });

      setFaceCrops(crops);
    } catch (err) {
      console.error("Analyze failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-purple-200 text-center">
        Upload Gambar untuk Deteksi Emosi
      </h1>

      <label className="mb-6">
        <input
          type="file"
          accept="image/*"
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
          <img
            ref={imageRef}
            src={previewUrl}
            alt="Preview"
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-purple-900 animate-pulse flex items-center justify-center text-purple-300 text-sm">
            Belum ada gambar diunggah
          </div>
        )}
      </div>

      {imageFile && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-6 py-3 rounded-full font-medium shadow-md transition duration-300 mb-10 ${
            loading
              ? "bg-purple-500 cursor-not-allowed opacity-70"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Menganalisis..." : "Analisis Gambar"}
        </button>
      )}

      {emotionResults.length > 0 && (
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
          {emotionResults.map((res, idx) => (
            <div
              key={idx}
              className="p-6 bg-white text-gray-800 rounded-2xl shadow-lg border border-purple-200"
            >
              <h2 className="text-lg font-bold text-purple-700 mb-3">
                Wajah {idx + 1}
              </h2>

              {faceCrops[idx] && (
                <img
                  src={faceCrops[idx]}
                  alt={`Wajah ${idx + 1}`}
                  className="w-28 h-28 object-cover rounded-lg border mb-3"
                />
              )}

              <div className="text-sm space-y-1">
                {Object.entries(res.emotions).map(([emotion, score]) => (
                  <p key={emotion}>
                    <span className="capitalize">{emotion}:</span>{" "}
                    <span className="font-medium">
                      {(score * 100).toFixed(2)}%
                    </span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
