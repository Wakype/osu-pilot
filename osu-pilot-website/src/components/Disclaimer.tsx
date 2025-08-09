import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Disclaimer: React.FC = () => {
  return (
    <section
      id="disclaimer"
      className="py-16 md:py-24 animate-in"
      style={{ animationDelay: "600ms" }}
    >
      <div className="max-w-3xl mx-auto text-center p-8 bg-amber-400/10 border border-amber-500/20 rounded-2xl">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-3 text-2xl font-bold mb-10 text-amber-200">Disclaimer</h2>
        <p className="mt-2 text-amber-300/80">
          This tool is for <b>educational purposes only</b>. Using bots or any
          unauthorized tools on official osu! servers is against the rules and
          <b> will get you banned</b>. The developer is not responsible for any
          damage or account restrictions that may result from using this
          software.
        </p>
        <p className="mt-4 font-semibold text-amber-200">
          Use it offline or in your own private servers. Don't ruin the game for others.
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
