export default function KPICard({ title, value, icon }) {
  return (
    <div className="bg-card rounded-xl shadow p-5 flex items-center justify-between">
      <div>
        <p className="text-muted text-sm">{title}</p>
        <p className="text-3xl font-semibold mt-2">{value}</p>
      </div>

      <div className="bg-secondary/20 text-secondary rounded-lg p-3 text-xl">
        {icon}
      </div>
    </div>
  )
}
