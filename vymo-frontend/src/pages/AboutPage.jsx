import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import dan from "../assets/dan.JPG"; // Ganti dengan path gambar asli
import dip from "../assets/dip.JPG"; // Ganti dengan path gambar asli

export default function AboutPage() {
  const contributors = [
    {
      name: "Ahmad Fauzidan Yahya Khainur",
      role: "AI Engineer & Backend Developer",
      img: dan, // Ganti dengan path gambar asli
      github: "https://github.com/zidanhkainur2",
      linkedin: "https://www.linkedin.com/in/ahmad-fauzidan-yahya-khainur/",
    },
    {
      name: "Nadhif Hafiz Pradiptya",
      role: "Frontend Developer & UI Designer",
      img: dip, // Ganti dengan path gambar asli
      github: "https://github.com/username2",
      linkedin: "https://linkedin.com/in/username2",
    },
  ];

  const techStack = [
    "python",
    "tensorflow",
    "keras",
    "javascript",
    "react",
    "tailwindcss",
    "vercel",
    "kaggle",
    "github",
    // "vscode",
    // "framer-motion",
    // "lucide-react",
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-16 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-purple-700 mb-6"
      >
        Tentang VYMO
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-3xl text-gray-700 text-lg leading-relaxed mb-10"
      >
        <strong>VYMO</strong> (Visual Your Mood) adalah platform cerdas berbasis{" "}
        <strong>machine learning</strong> yang dirancang untuk{" "}
        <strong>mendeteksi emosi wajah manusia</strong> melalui gambar dan
        video. Kami percaya bahwa teknologi dapat membantu memahami ekspresi
        emosional secara lebih mendalam untuk berbagai keperluan, mulai dari
        edukasi, kesehatan mental, hingga interaksi sosial berbasis AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid md:grid-cols-2 gap-6 max-w-4xl text-left"
      >
        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            🎯 Misi Kami
          </h2>
          <p className="text-gray-700">
            Menghadirkan solusi praktis dalam pengenalan emosi yang akurat dan
            real-time, dengan teknologi yang mudah diakses oleh semua kalangan.
          </p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            🧪 Fitur Unggulan
          </h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>Deteksi emosi real-time dari kamera</li>
            <li>Analisis emosi dari foto & video</li>
            <li>Multi-face detection dan visualisasi bounding box</li>
            <li>API analisis untuk integrasi sistem</li>
          </ul>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            🧑‍💻 Developer
          </h2>
          <p className="text-gray-700">
            Proyek ini dikembangkan sebagai bagian dari tugas akhir pengembangan
            aplikasi berbasis AI & pengolahan citra digital.
          </p>
        </div>

        {/* BARU: Tambahkan bagian "Bagaimana Cara Kerjanya?" */}
        <div className="p-6 border rounded-xl shadow-sm bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            🤖 Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-gray-700">
            Inti dari VYMO adalah model{" "}
            <strong>Convolutional Neural Network (CNN)</strong> yang dilatih
            pada dataset <strong>FER-2013</strong>. Backend kami yang dibangun
            dengan <strong>Python</strong> dan <strong>FastAPI</strong>{" "}
            menggunakan <strong>OpenCV</strong> untuk mendeteksi wajah, lalu
            mengumpankannya ke model untuk klasifikasi emosi.
          </p>
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold mt-16 mb-8 text-purple-700">
        👥 Kontributor
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {contributors.map((c, i) => (
          <div
            key={i}
            className="bg-white border p-6 rounded-xl shadow-md flex flex-col items-center"
          >
            <img
              src={c.img}
              alt={c.name}
              className="w-28 h-28 object-cover rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">{c.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{c.role}</p>
            <div className="flex space-x-4">
              <a href={c.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-blue-600 hover:text-blue-800" />
              </a>
              <a href={c.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 text-gray-700 hover:text-black" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mt-20 mb-8 text-purple-700">
        🛠️ Teknologi yang Digunakan
      </h2>
      <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
        {techStack.map((tech, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-gray-50 border p-4 rounded-xl shadow-sm w-28 h-28"
          >
            <img
              src={`https://cdn.simpleicons.org/${tech}/6b46c1/60`} // Ganti warna kalau perlu
              alt={tech}
              className="w-10 h-10 mb-2"
            />
            <p className="text-xs text-gray-700 font-medium text-center">
              {tech.replace("-", " ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
