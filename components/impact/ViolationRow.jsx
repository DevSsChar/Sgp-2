import ImpactBadge from "./ImpactBadge";
import { getImpactRowClass } from "@/utils/impactTheme";

export default function ViolationRow({
  violation,
  pageLabel,
  wcagTag,
  onFixSuggestion,
  showActions = true,
  compact = false,
  children,
}) {
  const firstNode = violation.nodes?.[0];
  const tag = wcagTag || (Array.isArray(violation.tags) ? violation.tags[0] : violation.id);

  return (
    <div className={`p-6 ${getImpactRowClass(violation.impact)}`}>
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <ImpactBadge impact={violation.impact} />
          <h4
            className={`font-mono-cx font-semibold mt-2 text-cx-on-surface ${
              compact ? "text-sm" : "text-lg"
            }`}
          >
            {violation.help || violation.description}
          </h4>
        </div>
        {tag && (
          <span className="font-mono-cx text-[11px] text-cx-outline shrink-0 uppercase">
            {tag}
          </span>
        )}
      </div>

      {violation.description && (
        <p className="font-mono-cx text-sm text-cx-on-surface-variant mb-4">
          {violation.description}
        </p>
      )}

      {pageLabel && (
        <p className="font-mono-cx text-[10px] uppercase tracking-widest text-cx-outline mb-4">
          Page: {pageLabel}
        </p>
      )}

      {(firstNode?.html || firstNode?.target) && (
        <div className="impact-code-block">
          <pre>
            <code>
              {firstNode.html || (firstNode.target || []).join(", ")}
            </code>
          </pre>
        </div>
      )}

      {firstNode?.failureSummary && (
        <p className="mt-3 text-sm text-cx-on-surface-variant">{firstNode.failureSummary}</p>
      )}

      {children}

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-3">
          {onFixSuggestion && (
            <button
              type="button"
              onClick={onFixSuggestion}
              className="btn-hud-primary"
            >
              Fix Suggestion
            </button>
          )}
          {violation.helpUrl && (
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-hud-secondary inline-flex items-center"
            >
              View Source
            </a>
          )}
        </div>
      )}
    </div>
  );
}
