export default function KPICard({ title, value, icon }) {
  return (
    <div className="bg-card rounded-xl shadow p-5 flex items-center justify-between border border-black/5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {title}
        </p>
        <p className="text-3xl font-semibold text-primary mt-2">
          {value}
        </p>
      </div>

      <div className="bg-secondary/15 text-secondary rounded-xl p-3 text-xl border border-secondary/20">
        {icon ?? " "}
      </div>
    </div>
  );
}
