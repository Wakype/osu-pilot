import React, { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
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
      className={`fixed cursor-pointer bottom-8 right-8 bg-cyan-500 hover:bg-cyan-600 text-white w-10 h-10 rounded-md shadow-lg flex items-center justify-center ease-in-out transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-x-0 rotate-0"
          : "opacity-0 pointer-events-none translate-x-12 rotate-180"
      }`}
    >
      <ChevronUpIcon className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;
