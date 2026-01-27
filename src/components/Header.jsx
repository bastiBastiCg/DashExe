export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-primary">
        Dashboard <span className="font-bold">FiberPro</span>
      </h2>

      <div className="text-muted text-2xl cursor-pointer">
        ☰
      </div>
    </header>
  )
}
