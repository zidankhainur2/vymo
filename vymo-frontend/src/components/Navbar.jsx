import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // --- EFEK UNTUK MENGUNCI SCROLL SAAT MENU MOBILE TERBUKA ---
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function untuk memastikan scroll kembali normal jika komponen di-unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Menutup menu saat berpindah halaman (navigasi)
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const featureItems = [
    { label: "Deteksi Real-Time", to: "/webcam" },
    { label: "Analisis Gambar", to: "/upload/image" },
    { label: "Analisis Video", to: "/upload/video" },
    { label: "Bandingkan Gambar", to: "/compare" },
  ];

  const navItems = [
    { label: "Panduan Emosi", to: "/education" },
    { label: "Tentang Kami", to: "/about" },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: "0%",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <nav className="relative max-w-5xl mx-auto px-6 py-3 flex justify-between items-center bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="text-xl font-bold text-white tracking-wide">
            VYMO
          </span>
        </Link>

        {/* --- Navigasi Desktop --- */}
        <div className="hidden md:flex items-center gap-6 text-white/80">
          <motion.div
            className="relative"
            onHoverStart={() => setDropdownOpen(true)}
            onHoverEnd={() => setDropdownOpen(false)}
          >
            <span className="flex items-center gap-1 font-medium cursor-default hover:text-white transition-colors">
              Fitur
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </span>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full mt-3 w-56 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-2"
                >
                  {featureItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        location.pathname === item.to
                          ? "text-white font-semibold bg-white/20"
                          : "text-gray-200"
                      } hover:bg-white/20 hover:text-white`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-medium transition-colors ${
                location.pathname === item.to
                  ? "text-white"
                  : "hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Tombol Hamburger untuk Mobile */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-white z-50"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* --- Menu Mobile --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed inset-0 bg-purple-950/80 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <span className="font-bold text-white">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2 text-lg">
              {[...featureItems, ...navItems].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block text-left p-3 font-semibold transition-colors rounded-lg ${
                    location.pathname === item.to
                      ? "text-purple-300 bg-white/10"
                      : "text-gray-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
