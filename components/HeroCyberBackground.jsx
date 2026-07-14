"use client";

export default function HeroCyberBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Rotating radar sweep */}
      <div className="ag-radar-sweep absolute -right-24 top-1/2 w-72 h-72 md:w-96 md:h-96 opacity-[0.12]" />

      {/* Target reticle rings */}
      <div className="ag-reticle relative absolute right-[8%] top-[18%] w-28 h-28 md:w-40 md:h-40 opacity-20" />
      <div className="ag-reticle ag-reticle--delay relative absolute left-[6%] bottom-[22%] w-20 h-20 opacity-15" />

      {/* Corner HUD brackets */}
      <div className="ag-hud-corner ag-hud-corner--tr absolute top-8 right-4 md:right-8 w-12 h-12" />
      <div className="ag-hud-corner ag-hud-corner--bl absolute bottom-8 left-4 md:left-8 w-10 h-10 opacity-60" />

      {/* Horizontal scan beam */}
      <div className="ag-hero-scanline absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cx-secondary-container to-transparent opacity-50" />

      {/* Security shield outline */}
      <svg
        className="ag-shield-float absolute left-[12%] top-[28%] w-16 h-16 md:w-20 md:h-20 text-cx-primary opacity-[0.08]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z" />
        <path d="M9 12l2 2 4-4" strokeWidth="1.5" />
      </svg>

      {/* Lock / scan nodes */}
      <svg
        className="ag-node-pulse absolute right-[18%] bottom-[30%] w-10 h-10 text-cx-secondary-container opacity-20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="5" y="11" width="14" height="10" />
        <path d="M8 11V8a4 4 0 118 0v3" />
      </svg>

      {/* Floating 2D diamonds */}
      <div className="ag-diamond absolute right-[30%] top-[12%] w-3 h-3 opacity-30" />
      <div className="ag-diamond ag-diamond--slow absolute left-[22%] bottom-[18%] w-2 h-2 opacity-25" />
      <div className="ag-diamond ag-diamond--reverse absolute right-[42%] bottom-[35%] w-2.5 h-2.5 opacity-20" />

      {/* Data stream ticks */}
      <div className="ag-data-stream absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-25">
        {["SCAN", "DOM", "ARIA", "WCAG", "NODE"].map((label, i) => (
          <span
            key={label}
            className="font-mono-cx text-[9px] tracking-[0.3em] text-cx-primary uppercase ag-data-tick"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Crosshair */}
      <div className="ag-crosshair absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 opacity-[0.06]" />
    </div>
  );
}
