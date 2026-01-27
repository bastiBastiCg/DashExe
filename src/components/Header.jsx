export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Dashboard <span className="font-bold">FiberPro</span>
        </h2>
        <p className="text-sm text-muted">
          Monitoreo comercial e instalaciones
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white border border-black/5 text-muted">
          Corporate Tech
        </span>
      </div>
    </header>
  );
}
