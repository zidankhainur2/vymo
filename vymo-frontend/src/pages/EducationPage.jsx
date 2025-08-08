import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  Frown,
  Angry,
  Meh,
  Annoyed,
  User,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

// Data untuk setiap emosi (sedikit penyesuaian pada ikon)
const emotionsData = [
  {
    name: "Senang (Happy)",
    icon: <Smile className="w-8 h-8 text-yellow-400" />,
    description:
      "Emosi positif yang ditandai dengan perasaan gembira, puas, dan sejahtera. Seringkali diekspresikan melalui senyuman.",
    cues: [
      "Sudut bibir ditarik ke atas dan ke belakang.",
      "Pipi terangkat, menciptakan kerutan di sekitar mata.",
      "Mata menyipit.",
    ],
  },
  {
    name: "Sedih (Sad)",
    icon: <Frown className="w-8 h-8 text-blue-400" />,
    description:
      "Emosi yang terkait dengan perasaan kehilangan atau kekecewaan. Menangis adalah salah satu ekspresi fisik yang umum.",
    cues: [
      "Sudut bibir menurun.",
      "Alis bagian dalam ditarik ke atas.",
      "Pandangan mata cenderung ke bawah.",
    ],
  },
  {
    name: "Marah (Angry)",
    icon: <Angry className="w-8 h-8 text-red-500" />,
    description:
      "Respons emosional yang kuat terhadap provokasi atau frustrasi. Dapat memotivasi tindakan konfrontatif.",
    cues: [
      "Alis diturunkan dan menyatu.",
      "Mata menatap tajam.",
      "Bibir menipis atau gigi terkatup rapat.",
    ],
  },
  {
    name: "Terkejut (Surprise)",
    icon: <HelpCircle className="w-8 h-8 text-teal-400" />,
    description:
      "Emosi singkat sebagai hasil dari peristiwa yang tidak terduga. Bisa positif, negatif, atau netral.",
    cues: [
      "Alis terangkat tinggi dan melengkung.",
      "Mata terbuka lebar.",
      "Mulut terbuka atau rahang sedikit turun.",
    ],
  },
  {
    name: "Takut (Fear)",
    icon: <User className="w-8 h-8 text-purple-400" />,
    description:
      "Mekanisme bertahan hidup sebagai respons terhadap ancaman. Mempersiapkan tubuh untuk 'fight or flight'.",
    cues: [
      "Alis terangkat dan menyatu.",
      "Mata atas terangkat, mata bawah tegang.",
      "Mulut sedikit terbuka dan bibir ditarik ke belakang.",
    ],
  },
  {
    name: "Jijik (Disgust)",
    icon: <Annoyed className="w-8 h-8 text-green-500" />,
    description:
      "Perasaan penolakan terhadap sesuatu yang dianggap tidak menyenangkan, baik secara fisik maupun sosial.",
    cues: ["Hidung berkerut.", "Bibir atas terangkat.", "Sudut mulut menurun."],
  },
  {
    name: "Netral (Neutral)",
    icon: <Meh className="w-8 h-8 text-gray-400" />,
    description:
      "Keadaan di mana tidak ada emosi kuat yang ditampilkan. Wajah dalam posisi istirahat tanpa ekspresi jelas.",
    cues: [
      "Otot-otot wajah rileks.",
      "Mulut tertutup tanpa ketegangan.",
      "Pandangan mata lurus dan tenang.",
    ],
  },
];

const AccordionItem = ({ item, i, expanded, setExpanded }) => {
  const isOpen = i === expanded;

  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
    >
      <motion.header
        initial={false}
        onClick={() => setExpanded(isOpen ? false : i)}
        className="flex justify-between items-center p-5 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {item.icon}
          <h2 className="text-lg font-semibold text-white">{item.name}</h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-6 h-6 text-purple-300" />
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: {
                opacity: 1,
                height: "auto",
                transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
              },
              collapsed: {
                opacity: 0,
                height: 0,
                transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
              },
            }}
            className="px-5 pb-5"
          >
            <p className="text-purple-200 mb-4">{item.description}</p>
            <div>
              <h4 className="font-semibold text-white mb-2">
                Ciri-ciri Utama:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                {item.cues.map((cue, idx) => (
                  <li key={idx}>{cue}</li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function EducationPage() {
  const [expanded, setExpanded] = useState(0); // Item pertama terbuka secara default

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white px-4 py-16">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold pt-24">
            Panduan Emosi Wajah
          </h1>
          <p className="mt-4 text-lg text-purple-200">
            Pelajari berbagai emosi yang dapat dideteksi oleh VYMO dan ciri-ciri
            visualnya.
          </p>
        </motion.div>

        <div className="space-y-4">
          {emotionsData.map((item, i) => (
            <AccordionItem
              key={i}
              i={i}
              item={item}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
