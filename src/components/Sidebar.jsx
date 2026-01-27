import { useData } from "../context/DataContext";
import BrandLogo from "./BrandLogo";

export default function Sidebar() {
  const { rawData, filters, setFilters } = useData();

  const servicios = ["Todos", ...new Set(rawData.map(r => r["Servicio"]).filter(Boolean))];
  const distritos = ["Todos", ...new Set(rawData.map(r => r["Distrito"]).filter(Boolean))];

  const inputClass =
    "w-full h-10 rounded-lg bg-white/10 border border-white/15 px-3 text-sm text-white " +
    "focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <aside className="w-64 text-white p-4 flex flex-col
      bg-gradient-to-b from-[#081A2A] via-[#0F2A44] to-[#0B2F55]">
      
      {/* Logo */}
      <div className="mb-8">
        <BrandLogo />
      </div>

      {/* FILTROS */}
      <div className="space-y-4 flex-1">
        {/* Servicio */}
        <select
          className={inputClass}
          value={filters.servicio}
          onChange={(e) => setFilters({ ...filters, servicio: e.target.value })}
        >
          <option value="Todos" className="text-gray-900">Servicio</option>
          {servicios.filter(s => s !== "Todos").map((s) => (
            <option key={s} value={s} className="text-gray-900">{s}</option>
          ))}
        </select>

        {/* Fecha inicio */}
        <input
          type="date"
          className={inputClass}
          value={filters.fechaInicio || ""}
          onChange={(e) =>
            setFilters({ ...filters, fechaInicio: e.target.value || null })
          }
        />

        {/* Fecha fin */}
        <input
          type="date"
          className={inputClass}
          value={filters.fechaFin || ""}
          onChange={(e) =>
            setFilters({ ...filters, fechaFin: e.target.value || null })
          }
        />

        {/* Distrito */}
        <select
          className={inputClass}
          value={filters.distrito}
          onChange={(e) => setFilters({ ...filters, distrito: e.target.value })}
        >
          <option value="Todos" className="text-gray-900">Distrito</option>
          {distritos.filter(d => d !== "Todos").map((d) => (
            <option key={d} value={d} className="text-gray-900">{d}</option>
          ))}
        </select>

        {/* mini separador marca */}
        <div className="pt-2">
          <div className="h-px bg-white/10" />
        </div>

        <div className="text-xs text-white/60">
          Tip: sube tu Excel para actualizar los gráficos.
        </div>
      </div>

      {/* Botón */}
      <button
        onClick={() =>
          setFilters({
            ...filters,
            servicio: "Todos",
            fechaInicio: null,
            fechaFin: null,
            distrito: "Todos",
          })
        }
        className="mt-6 h-10 rounded-lg text-sm font-medium
          bg-white/15 hover:bg-white/20 border border-white/10"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
