import { Link } from "react-router-dom";
import { ChevronRight, CheckCircle, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

// Varian animasi untuk container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Varian animasi untuk setiap item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Komponen kecil untuk menampilkan item manfaat/keunggulan
function BenefitItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-gray-300 text-sm font-medium">{text}</span>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 min-h-screen flex items-center justify-center">
      <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* --- Konten Kiri (Informatif & Aksi) --- */}
        <motion.div
          // PERUBAHAN 1: Jarak vertikal disesuaikan untuk mobile
          className="flex flex-col space-y-6 md:space-y-8 text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Judul & Paragraf */}
          <motion.div className="space-y-5" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Analisis Emosi Wajah <br />
              Secara Real-Time
            </h1>
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              VYMO memanfaatkan AI untuk mendeteksi ekspresi emosi Anda secara
              instan. Mudah, cepat, dan cerdas.
            </p>
          </motion.div>

          {/* Tombol Aksi Utama (CTA) */}
          <motion.div variants={itemVariants}>
            <Link
              to="/webcam"
              // PERUBAHAN 2: Tombol dibuat inline-block agar max-w-xs berfungsi baik di tengah
              className="group inline-block w-full max-w-xs text-center bg-purple-600 hover:bg-purple-700 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105"
            >
              Coba Deteksi Real-Time
              <ChevronRight className="inline-block ml-1 w-5 h-5 align-middle transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* --- Daftar Manfaat Utama (Pengganti InfoSection) --- */}
          <motion.div
            // PERUBAHAN 3: Layout diubah menjadi kolom di mobile, dan baris di desktop.
            className="flex flex-col items-center gap-4 pt-4 lg:flex-row lg:items-start lg:gap-6"
            variants={itemVariants}
          >
            <BenefitItem
              icon={<CheckCircle className="w-5 h-5 text-green-400" />}
              text="Akurasi Tinggi"
            />
            <BenefitItem
              icon={<Zap className="w-5 h-5 text-yellow-400" />}
              text="Proses Cepat"
            />
            <BenefitItem
              icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
              text="Privasi Terjamin"
            />
          </motion.div>
        </motion.div>

        {/* --- Konten Kanan (Gambar Ilustrasi) --- */}
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="relative w-full max-w-md group">
            <motion.img
              src={logo}
              alt="Ilustrasi Emosi VYMO"
              className="w-full h-auto object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
              whileHover={{ scale: 1.05, rotate: 1 }}
            />
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
