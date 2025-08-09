import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      className="border-t border-slate-700 animate-in"
      style={{ animationDelay: "700ms" }}
    >
      <div className="container mx-auto py-8 px-6 text-center text-sm text-slate-500">
        <p>osu!pilot is a project for learning and exploration.</p>
        <p className="mt-1">Released under the MIT License.</p>
      </div>
    </footer>
  );
};

export default Footer;
