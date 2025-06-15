import { Link } from "react-router-dom";
import { Camera, ImageIcon, Video, ChevronRight } from "lucide-react";
import logo from "../assets/logo.png";

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 min-h-screen flex items-center justify-center">
      <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
        {/* Left Content */}
        <div className="flex flex-col space-y-8 text-center lg:text-left">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Analisis Emosi Wajah <br />
              Secara Real-Time
            </h1>
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl leading-relaxed">
              VYMO memanfaatkan Machine Learning untuk mendeteksi ekspresi emosi
              Anda dari kamera, gambar, maupun video. Mudah, cepat, dan cerdas.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-start space-y-6">
            <Link
              to="/webcam"
              className="w-full max-w-xs text-center bg-purple-500 hover:bg-purple-600 transition-colors duration-300 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
            >
              Coba Sekarang
              <ChevronRight className="inline-block ml-2 w-5 h-5 align-middle transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
              <Feature icon={Camera} label="Deteksi Kamera" />
              <Feature icon={ImageIcon} label="Analisis Gambar" />
              <Feature icon={Video} label="Analisis Video" />
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex items-center justify-center relative">
          <div className="relative w-full max-w-[500px] group">
            <img
              src={logo}
              alt="Ilustrasi Emosi"
              className="w-full h-auto object-contain transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1 drop-shadow-xl"
            />
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
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

function Feature({ icon: Icon, label }) {
  return (
    <div className="flex items-center space-x-2 hover:text-purple-300 transition-colors">
      <Icon className="w-5 h-5 text-purple-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
