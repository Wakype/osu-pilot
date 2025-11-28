// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Setup from "./components/Setup";
import HowToUse from "./components/HowToUse";
import Hotkeys from "./components/Hotkeys";
import Disclaimer from "./components/Disclaimer";
import Faq from "./components/Faq";
import Updates from "./components/Updates";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-950 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Grid Global */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern h-screen w-screen" />

      {/* Gradient Blobs Global */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <Navbar />

      <main className="relative z-10 flex flex-col gap-24 pb-24">
        <Header />
        <div className="container mx-auto px-4 md:px-6 flex flex-col gap-32">
          <Features />
          <HowItWorks />
          <Setup />
          <HowToUse />
          <Hotkeys />
          <Faq />
          <Updates />
          <Disclaimer />
        </div>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;
