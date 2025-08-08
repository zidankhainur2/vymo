import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import WebcamPage from "../pages/WebcamPage";
import ImageUploadPage from "../pages/ImageUploadPage";
import VideoUploadPage from "../pages/VideoUploadPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ComparisonPage from "../pages/ComparisonPage"; // BARU
import EducationPage from "../pages/EducationPage"; // BARU
import { AnimatePresence } from "framer-motion";

export default function AppRouter() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/webcam" element={<WebcamPage />} />
              <Route path="/upload/image" element={<ImageUploadPage />} />
              <Route path="/upload/video" element={<VideoUploadPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/compare" element={<ComparisonPage />} />{" "}
              {/* BARU */}
              <Route path="/education" element={<EducationPage />} />{" "}
              {/* BARU */}
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
