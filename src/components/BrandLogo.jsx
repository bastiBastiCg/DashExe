export default function BrandLogo() {
  return (
    <div className="select-none">
      <div className="flex items-center gap-2">
        {/* símbolo simple tipo fibra */}
        <span className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
          <span className="w-4 h-4 rounded-full border-2 border-gold relative">
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
          </span>
        </span>

        <div className="leading-tight">
          <div className="text-xl font-bold tracking-wide text-white">
            Fiber<span className="text-accent">Pro</span>
          </div>
          <div className="text-xs text-white/70">Internet de otro nivel</div>
        </div>
      </div>
    </div>
  );
}
