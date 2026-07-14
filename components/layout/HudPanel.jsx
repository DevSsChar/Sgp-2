export default function HudPanel({ tag, children, className = "", innerClassName = "p-6" }) {
  return (
    <section className={`hud-panel ${className}`}>
      {tag && <div className="hud-panel-tag">{tag}</div>}
      <div className={innerClassName}>{children}</div>
    </section>
  );
}
