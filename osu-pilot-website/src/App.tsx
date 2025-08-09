import React from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Setup from "./components/Setup";
import Hotkeys from "./components/Hotkeys";
import Faq from "./components/Faq";
import Updates from "./components/Updates";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const App: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950">
      <Navbar />
      <Header />
      <main className="container mx-auto px-6 py-16 md:py-24 space-y-20 md:space-y-32">
        <Features />
        <HowItWorks />
        <Setup />
        <Hotkeys />
        <Faq />
        <Updates />
        <Disclaimer />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;
