// src/components/ScrollToTop.jsx
/*
  Floating Scroll-To-Top Button
  - Appears after scroll
  - Fixed position above footer
*/

import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full
                 bg-gradient-to-r from-emerald-400 to-green-500
                 text-black font-bold shadow-xl
                 hover:scale-110 transition"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
