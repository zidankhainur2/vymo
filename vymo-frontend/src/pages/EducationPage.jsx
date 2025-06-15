import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Angry,
  Meh,
  Annoyed,
  User,
  HelpCircle,
} from "lucide-react"; // Menggunakan ikon yang relevan

// Data untuk setiap emosi
const emotionsData = [
  {
    name: "Senang (Happy)",
    icon: <Smile className="w-10 h-10 text-yellow-400" />,
    color: "yellow",
    description:
      "Emosi positif yang ditandai dengan perasaan gembira, puas, dan sejahtera. Seringkali diekspresikan melalui senyuman.",
    cues: [
      "Sudut bibir ditarik ke atas dan ke belakang.",
      "Pipi terangkat, menciptakan kerutan di sekitar mata (kerutan 'Duchenne').",
      "Mata menyipit.",
    ],
  },
  {
    name: "Sedih (Sad)",
    icon: <Frown className="w-10 h-10 text-blue-400" />,
    color: "blue",
    description:
      "Emosi yang terkait dengan perasaan kehilangan, duka, atau kekecewaan. Menangis adalah salah satu ekspresi fisik yang paling umum.",
    cues: [
      "Sudut bibir menurun.",
      "Alis bagian dalam ditarik ke atas.",
      "Dagu mungkin berkerut.",
      "Pandangan mata cenderung ke bawah.",
    ],
  },
  {
    name: "Marah (Angry)",
    icon: <Angry className="w-10 h-10 text-red-500" />,
    color: "red",
    description:
      "Respons emosional yang kuat terhadap provokasi, ancaman, atau rasa frustrasi. Dapat memotivasi tindakan konfrontatif.",
    cues: [
      "Alis diturunkan dan menyatu.",
      "Mata melotot atau menatap tajam.",
      "Bibir menipis atau gigi terkatup rapat.",
      "Rahang mengencang.",
    ],
  },
  {
    name: "Netral (Neutral)",
    icon: <Meh className="w-10 h-10 text-gray-400" />,
    color: "gray",
    description:
      "Keadaan di mana tidak ada emosi kuat yang ditampilkan. Wajah dalam posisi istirahat tanpa ekspresi yang jelas.",
    cues: [
      "Otot-otot wajah rileks.",
      "Mulut tertutup tanpa ketegangan.",
      "Pandangan mata lurus dan tenang.",
    ],
  },
  {
    name: "Terkejut (Surprise)",
    icon: <HelpCircle className="w-10 h-10 text-teal-400" />,
    color: "teal",
    description:
      "Emosi singkat yang dialami sebagai hasil dari peristiwa yang tidak terduga. Bisa positif, negatif, atau netral.",
    cues: [
      "Alis terangkat tinggi dan melengkung.",
      "Mata terbuka lebar.",
      "Mulut terbuka atau rahang sedikit turun.",
    ],
  },
  {
    name: "Takut (Fear)",
    icon: <User className="w-10 h-10 text-purple-400" />, // Lucide tidak punya ikon 'takut' yang spesifik
    color: "purple",
    description:
      "Mekanisme bertahan hidup dasar sebagai respons terhadap ancaman yang dirasakan. Mempersiapkan tubuh untuk 'fight or flight'.",
    cues: [
      "Alis terangkat dan menyatu.",
      "Mata atas terangkat, mata bawah tegang.",
      "Mulut sedikit terbuka dan bibir ditarik ke belakang secara horizontal.",
    ],
  },
  {
    name: "Jijik (Disgust)",
    icon: <Annoyed className="w-10 h-10 text-green-500" />,
    color: "green",
    description:
      "Perasaan penolakan terhadap sesuatu yang dianggap tidak menyenangkan, baik secara fisik (rasa, bau) maupun sosial (tindakan).",
    cues: ["Hidung berkerut.", "Bibir atas terangkat.", "Sudut mulut menurun."],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700">
            Panduan Emosi Wajah
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Pelajari tentang berbagai emosi yang dapat dideteksi oleh VYMO dan
            ciri-ciri visualnya.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {emotionsData.map((emotion, i) => (
            <motion.div
              key={emotion.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`border-l-4 border-${emotion.color}-500 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center mb-4">
                {emotion.icon}
                <h2
                  className={`ml-4 text-2xl font-bold text-${emotion.color}-800`}
                >
                  {emotion.name}
                </h2>
              </div>
              <p className="text-gray-700 mb-4">{emotion.description}</p>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Ciri-ciri Utama:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {emotion.cues.map((cue, idx) => (
                    <li key={idx}>{cue}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
