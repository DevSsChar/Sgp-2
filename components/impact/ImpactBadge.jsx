import { getImpactBadgeClass, normalizeImpact } from "@/utils/impactTheme";

export default function ImpactBadge({ impact, className = "" }) {
  const level = normalizeImpact(impact);
  return (
    <span className={`${getImpactBadgeClass(impact)} ${className}`.trim()}>
      {level}
    </span>
  );
}
