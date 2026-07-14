export const SCAN_PHASES = [
  { id: "validating", label: "Validating target URL..." },
  { id: "connecting", label: "Connecting to database..." },
  { id: "initializing", label: "Initializing browser..." },
  { id: "authenticating", label: "Establishing authenticated session..." },
  { id: "crawling", label: "Discovering pages..." },
  { id: "scanning", label: "Scanning pages..." },
  { id: "building", label: "Generating report..." },
  { id: "saving", label: "Saving report..." },
  { id: "complete", label: "Scan complete" },
];

const PHASE_RANGES = {
  validating: [0, 5],
  connecting: [5, 10],
  initializing: [10, 14],
  authenticating: [14, 20],
  crawling: [20, 28],
  scanning: [28, 90],
  building: [90, 95],
  saving: [95, 99],
  complete: [100, 100],
};

export function getPhaseIndex(phase) {
  return SCAN_PHASES.findIndex((p) => p.id === phase);
}

export function calculateProgress(phase, { pageIndex = 0, pageTotal = 0, discovered = 0, maxPages = 30 } = {}) {
  const range = PHASE_RANGES[phase];
  if (!range) return 0;

  const [start, end] = range;

  if (phase === "crawling" && discovered > 0) {
    const ratio = Math.min(discovered, maxPages) / maxPages;
    return Math.round(Math.min(end, start + ratio * (end - start)));
  }

  if (phase === "scanning" && pageTotal > 0 && pageIndex > 0) {
    const ratio = pageIndex / pageTotal;
    return Math.round(Math.min(end, start + ratio * (end - start)));
  }

  if (phase === "complete") return 100;

  return Math.round(start + (end - start) * 0.25);
}

export function buildProgressMessage(phase, ctx = {}) {
  switch (phase) {
    case "validating":
      return "Validating target URL...";
    case "connecting":
      return "Connecting to database...";
    case "initializing":
      return "Initializing browser...";
    case "authenticating":
      return "Establishing authenticated session...";
    case "crawling":
      return ctx.discovered
        ? `Discovering pages... (${ctx.discovered} found)`
        : "Discovering pages...";
    case "scanning": {
      const { pageIndex, pageTotal, currentUrl } = ctx;
      if (pageIndex && pageTotal) {
        let path = "";
        try {
          path = new URL(currentUrl).pathname || "/";
        } catch {
          path = currentUrl || "";
        }
        return `Scanning page ${pageIndex} of ${pageTotal} — ${path}`;
      }
      return "Scanning pages...";
    }
    case "building":
      return "Generating report...";
    case "saving":
      return "Saving report...";
    case "complete":
      return "Scan complete";
    default:
      return "Processing...";
  }
}

export function getStepStatus(currentPhase, stepPhase) {
  const current = getPhaseIndex(currentPhase);
  const step = getPhaseIndex(stepPhase);

  if (current < 0 || step < 0) return "pending";
  if (currentPhase === "complete") return "completed";
  if (step < current) return "completed";
  if (step === current) return "active";
  return "pending";
}

export function createInitialScanSteps() {
  return SCAN_PHASES.filter((p) => p.id !== "complete").map((p) => ({
    phase: p.id,
    message: p.label,
  }));
}

export const PHASE_ICONS = {
  validating: "verified",
  connecting: "database",
  initializing: "rocket_launch",
  authenticating: "key",
  crawling: "travel_explore",
  scanning: "document_scanner",
  building: "analytics",
  saving: "cloud_upload",
  complete: "task_alt",
};

export function getPhaseIcon(phase) {
  return PHASE_ICONS[phase] || "hourglass_empty";
}

export function buildProgressPayload(phase, ctx = {}) {
  const message = buildProgressMessage(phase, ctx);
  const progress = calculateProgress(phase, ctx);

  return {
    type: "progress",
    phase,
    message,
    progress,
    pageIndex: ctx.pageIndex ?? null,
    pageTotal: ctx.pageTotal ?? null,
    currentUrl: ctx.currentUrl ?? null,
    discovered: ctx.discovered ?? null,
  };
}
