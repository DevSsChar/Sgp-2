"use client";

export default function Features() {
  return (
    <section
      id="features"
      className="bg-cx-surface-container-lowest px-4 md:px-10 py-14 md:py-16 border-y border-cx-outline-variant/10"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="flex flex-col justify-center">
          <span className="font-mono-cx text-cx-primary text-[10px] mb-4 tracking-[0.35em] uppercase">
            Visualized compliance
          </span>
          <h2 className="font-mono-cx text-[clamp(1.75rem,4vw,2.5rem)] leading-none mb-6 uppercase font-extrabold tracking-tighter">
            Precision
            <br />
            Diagnostics
          </h2>
          <p className="font-mono-cx text-cx-on-surface-variant opacity-60 max-w-sm mb-6 text-sm leading-relaxed">
            Real-time DOM mutation monitoring. Every node analyzed. Every failure corrected
            before the browser paints. Automated WCAG 2.1 AA compliance checks across your
            entire website.
          </p>
          <div className="flex gap-8 border-t border-cx-outline-variant/20 pt-6">
            <div>
              <div className="font-mono-cx text-2xl md:text-3xl text-cx-primary font-extrabold">
                2min
              </div>
              <div className="font-mono-cx text-[10px] text-cx-outline-variant uppercase tracking-widest">
                Scan Time
              </div>
            </div>
            <div>
              <div className="font-mono-cx text-2xl md:text-3xl text-cx-primary font-extrabold">
                100%
              </div>
              <div className="font-mono-cx text-[10px] text-cx-outline-variant uppercase tracking-widest">
                Coverage
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-square max-w-xs mx-auto lg:max-w-none w-full border border-cx-primary/20 bg-cx-surface flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-[120%] h-[120%] border border-cx-primary animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="z-10 text-center">
            <div className="font-mono-cx text-[clamp(3rem,10vw,5rem)] text-cx-primary leading-none font-extrabold">
              98.2
            </div>
            <div className="font-mono-cx text-[10px] tracking-[0.4em] text-cx-on-surface opacity-40 uppercase">
              Stability_Index
            </div>
          </div>
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cx-primary" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cx-primary" />
        </div>
      </div>
    </section>
  );
}
