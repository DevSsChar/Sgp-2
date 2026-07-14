"use client";

export default function LandingCyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
      <div className="ag-grid-bg absolute inset-0 opacity-40" />
      <div className="scanning-pulse" />
      <div className="ag-scan-pulse-vertical" />

      {/* Hex pattern overlay */}
      <div className="ag-hex-mesh absolute inset-0 opacity-[0.04]" />

      {/* Floating scan nodes along edges */}
      <div className="ag-edge-node absolute top-[20%] left-2 w-1.5 h-1.5" />
      <div className="ag-edge-node ag-edge-node--d2 absolute top-[45%] left-2 w-1 h-1" />
      <div className="ag-edge-node ag-edge-node--d3 absolute top-[70%] right-2 w-1.5 h-1.5" />
    </div>
  );
}
