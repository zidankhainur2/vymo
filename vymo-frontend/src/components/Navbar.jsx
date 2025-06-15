import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Panduan Emosi", to: "/education" },
    { label: "Deteksi Real-Time", to: "/webcam" },
    { label: "Analisis Gambar", to: "/upload/image" },
    { label: "Analisis Video", to: "/upload/video" },
    { label: "Bandingkan Gambar", to: "/compare" },
    { label: "Tentang Kami", to: "/about" },
  ];

  return (
    <nav className="w-full bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl py-4 flex justify-between items-center mx-auto px-4 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-purple-700 tracking-wide"
        >
          VYMO
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-medium transition duration-300 ${
                location.pathname === item.to
                  ? "text-purple-700 underline"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 font-medium transition duration-300 ${
                location.pathname === item.to
                  ? "text-purple-700 underline"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
