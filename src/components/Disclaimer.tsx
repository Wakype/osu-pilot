import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const Disclaimer: React.FC = () => {
  return (
    <section className="max-w-3xl mx-auto py-12">
      <div className="relative overflow-hidden rounded-2xl bg-amber-500/5 border border-amber-500/20 p-8 text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

        <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-amber-200 mb-2">
          Use at Your Own Risk
        </h2>
        <p className="text-amber-100/60 text-sm leading-relaxed max-w-lg mx-auto">
          This software is for <b>educational purposes only</b>. Usage on
          official osu! servers is strictly prohibited and will result in a
          permanent ban. The developer assumes no responsibility for account
          restrictions. Please play fair and respect the community.
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
