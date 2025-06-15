import { ShieldCheck, BrainCircuit, Zap, Smile } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
      title: "Privasi Terjaga",
      desc: "Data pengguna tidak disimpan, dan pemrosesan dilakukan secara lokal/sementara.",
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-purple-600" />,
      title: "Akurasi Tinggi",
      desc: "Model deep learning dilatih pada dataset berkualitas untuk hasil analisis optimal.",
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "Cepat & Real-Time",
      desc: "Analisis dilakukan dalam hitungan detik, bahkan untuk deteksi kamera langsung.",
    },
    {
      icon: <Smile className="w-8 h-8 text-purple-600" />,
      title: "Mudah Digunakan",
      desc: "Tampilan antarmuka ramah pengguna dan navigasi intuitif.",
    },
  ];

  return (
    <section className="bg-white text-gray-800 py-16 px-6 md:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Kenapa Memilih VYMO?
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-purple-50 hover:bg-purple-100 transition p-6 rounded-xl shadow-md text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-purple-200 rounded-full">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-lg text-purple-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-purple-700">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
