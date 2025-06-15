import { Camera, Loader2, Download } from "lucide-react";

export default function HowToUseSection() {
  return (
    <section className="bg-white text-gray-800 py-16 px-6 md:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Bagaimana Cara Menggunakannya?
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        <StepCard
          icon={<Camera className="w-8 h-8 text-purple-600" />}
          title="Pilih Mode Deteksi"
          desc="Gunakan kamera secara real-time, unggah gambar, atau video untuk analisis emosi."
        />
        <StepCard
          icon={
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin-slow" />
          }
          title="Tunggu Proses Analisis"
          desc="Model AI kami menganalisis ekspresi wajah dengan cepat dan akurat."
        />
        <StepCard
          icon={<Download className="w-8 h-8 text-purple-600" />}
          title="Lihat & Unduh Hasil"
          desc="Tampilkan hasil visual emosi dominan, dan unduh jika diperlukan."
        />
      </div>

      <style jsx="true">{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
}

function StepCard({ icon, title, desc }) {
  return (
    <div className="bg-purple-100 hover:bg-purple-200 transition p-6 rounded-xl shadow-md text-center">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-purple-200 rounded-full">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-purple-800 mb-2">{title}</h3>
      <p className="text-sm text-purple-700">{desc}</p>
    </div>
  );
}
