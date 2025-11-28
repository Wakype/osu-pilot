import React, { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed z-50 bottom-8 right-8 p-3 rounded-xl border border-slate-700 bg-slate-800/80 backdrop-blur-md text-cyan-400 shadow-lg shadow-black/50 hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all duration-500 transform ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <ChevronUpIcon className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;
