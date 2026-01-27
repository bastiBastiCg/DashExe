export default function Filters() {
  return (
    <div className="flex gap-4">
      <select className="border rounded-lg px-3 py-2 text-sm">
        <option>Todos los servicios</option>
        <option>Internet</option>
        <option>Dúo</option>
      </select>

      <input
        type="date"
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="date"
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  )
}
