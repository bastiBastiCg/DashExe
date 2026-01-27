import { useData } from "../context/DataContext";

export default function Sidebar() {
  const { rawData, filters, setFilters } = useData();

  const servicios = [
    "Todos",
    ...new Set(rawData.map((r) => r["Servicio"]).filter(Boolean)),
  ];

  const distritos = [
    "Todos",
    ...new Set(rawData.map((r) => r["Distrito"]).filter(Boolean)),
  ];

  const inputClass =
    "w-full h-10 rounded-lg bg-white/10 border border-white/15 px-3 text-sm text-white " +
    "focus:outline-none focus:ring-2 focus:ring-secondary/40";

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0f2a44] to-[#1b3d5c] text-white p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-wide">
          Fiber<span className="text-secondary">Pro</span>
        </h1>
        <p className="text-xs opacity-80">Internet de otro nivel</p>
      </div>

      {/* FILTROS */}
      <div className="space-y-4 flex-1">
        {/* SERVICIO */}
        <select
          className={inputClass}
          value={filters.servicio}
          onChange={(e) =>
            setFilters({ ...filters, servicio: e.target.value })
          }
        >
          <option value="Todos" className="text-gray-900">
            Servicio
          </option>
          {servicios
            .filter((s) => s !== "Todos")
            .map((s) => (
              <option key={s} value={s} className="text-gray-900">
                {s}
              </option>
            ))}
        </select>

        {/* FECHA INICIO */}
        <input
          type="date"
          className={inputClass}
          value={filters.fechaInicio || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              fechaInicio: e.target.value || null,
            })
          }
        />

        {/* FECHA FIN */}
        <input
          type="date"
          className={inputClass}
          value={filters.fechaFin || ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              fechaFin: e.target.value || null,
            })
          }
        />

        {/* DISTRITO */}
        <select
          className={inputClass}
          value={filters.distrito}
          onChange={(e) =>
            setFilters({ ...filters, distrito: e.target.value })
          }
        >
          <option value="Todos" className="text-gray-900">
            Distrito
          </option>
          {distritos
            .filter((d) => d !== "Todos")
            .map((d) => (
              <option key={d} value={d} className="text-gray-900">
                {d}
              </option>
            ))}
        </select>
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
        className="mt-6 h-10 bg-white/15 hover:bg-white/20 rounded-lg text-sm font-medium border border-white/10"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
