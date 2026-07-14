export function normalizeImpact(impact) {
  const level = (impact || "needs-review").toLowerCase();
  if (["critical", "serious", "moderate", "minor", "needs-review"].includes(level)) {
    return level;
  }
  return "needs-review";
}

export function getImpactBadgeClass(impact) {
  const level = normalizeImpact(impact);
  return `impact-badge impact-badge-${level === "needs-review" ? "needs-review" : level}`;
}

export function getImpactRowClass(impact) {
  const level = normalizeImpact(impact);
  return `impact-row impact-row-${level === "needs-review" ? "needs-review" : level}`;
}

export function getImpactCountClass(impact) {
  const level = normalizeImpact(impact);
  if (level === "needs-review") return "bg-cx-surface-container-high text-cx-on-surface-variant";
  return `impact-count-${level}`;
}

export function countViolationsByImpact(violations) {
  return (violations || []).reduce((acc, v) => {
    const key = normalizeImpact(v.impact);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}
