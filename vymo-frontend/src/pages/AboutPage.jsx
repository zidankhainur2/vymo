import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import dan from "../assets/dan.JPG";
import dip from "../assets/dip.JPG";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {
  const contributors = [
    {
      name: "Ahmad Fauzidan Yahya Khainur",
      role: "AI Engineer & Backend Developer",
      img: dan,
      github: "https://github.com/zidanhkainur2",
      linkedin: "https://www.linkedin.com/in/ahmad-fauzidan-yahya-khainur/",
    },
    {
      name: "Nadhif Hafiz Pradiptya",
      role: "Frontend Developer & UI Designer",
      img: dip,
      github: "https://github.com/username2", // Ganti dengan link yang benar
      linkedin: "https://linkedin.com/in/username2", // Ganti dengan link yang benar
    },
  ];

  const techStack = [
    "python",
    "tensorflow",
    "keras",
    "opencv",
    "fastapi",
    "react",
    "tailwindcss",
    "vite",
    "github",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white px-4 py-24">
      <div className="container mx-auto max-w-4xl text-center">
        {/* --- Bagian Header --- */}
        <motion.div
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 pt-24">
            Tentang VYMO
          </h1>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto leading-relaxed">
            <strong>VYMO</strong> (Visual Your Mood) adalah platform cerdas yang
            dirancang untuk mendeteksi emosi wajah manusia melalui gambar dan
            video, menjembatani teknologi AI dengan pemahaman ekspresi manusia.
          </p>
        </motion.div>

        {/* --- Bagian Misi & Teknologi --- */}
        <motion.div
          className="mb-20 text-left bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-300">
            Misi dan Teknologi di Balik VYMO
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Misi kami adalah menyediakan solusi pengenalan emosi yang akurat dan
            mudah diakses. Inti dari VYMO adalah model{" "}
            <strong>Convolutional Neural Network (CNN)</strong> yang dilatih
            pada dataset <strong>FER-2013</strong>. Backend kami yang dibangun
            dengan <strong>Python</strong> dan <strong>FastAPI</strong>{" "}
            menggunakan <strong>OpenCV</strong> untuk mendeteksi wajah, lalu
            mengumpankannya ke model untuk klasifikasi emosi secara real-time.
          </p>
        </motion.div>

        {/* --- Bagian Kontributor --- */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold mb-10 text-white">
            Tim Pengembang
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {contributors.map((c, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-28 h-28 object-cover rounded-full mb-4 border-2 border-purple-400"
                />
                <h3 className="text-xl font-semibold text-white">{c.name}</h3>
                <p className="text-sm text-purple-300 mb-4">{c.role}</p>
                <div className="flex space-x-5">
                  <a
                    href={c.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a
                    href={c.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- Bagian Teknologi --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold mb-10 text-white">
            Teknologi yang Digunakan
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <div
                key={tech}
                className="flex flex-col items-center text-center group"
              >
                <img
                  src={`https://cdn.simpleicons.org/${tech}/a78bfa`}
                  alt={tech}
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 capitalize">
                  {tech.replace("-", " ")}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
