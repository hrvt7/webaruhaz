"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-ink text-white py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="text-[11px] tracking-widest-3 uppercase opacity-70 mb-5">
          The Journal
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          Join the LUNARA journal
        </h2>
        <p className="mt-5 text-sm md:text-base opacity-80 max-w-md mx-auto">
          Új kollekciók, editorialok és csendes ajánlatok — havonta egyszer,
          nem többször.
        </p>
        {sent ? (
          <div className="mt-10 text-sm opacity-90">
            Köszönjük! Hamarosan jelentkezünk.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 bg-transparent border-b border-white/40 focus:border-white py-2 text-sm outline-none text-center sm:text-left"
            />
            <button className="bg-white text-ink text-[11px] tracking-widest-2 uppercase px-6 py-3 hover:bg-bone transition-colors">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
