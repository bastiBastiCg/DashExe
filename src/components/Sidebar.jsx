import { useData } from "../context/DataContext";

export default function Sidebar() {
  const { rawData, filters, setFilters } = useData();

  // 🔹 Opciones dinámicas desde el Excel
  const servicios = [
    "Todos",
    ...new Set(rawData.map(r => r["Servicio"]).filter(Boolean)),
  ];

  const distritos = [
    "Todos",
    ...new Set(rawData.map(r => r["Distrito"]).filter(Boolean)),
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0f2a44] to-[#1b3d5c] text-white p-4 flex flex-col">

      {/* LOGO */}
      <div className="mb-8">
        <h1 className="text-xl font-bold">FiberPro</h1>
        <p className="text-sm opacity-80">Internet de otro nivel</p>
      </div>

      {/* FILTROS */}
      <div className="space-y-4 flex-1">

        {/* SERVICIO */}
        <select
          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm"
          value={filters.servicio}
          onChange={(e) =>
            setFilters({ ...filters, servicio: e.target.value })
          }
        >
          <option value="Todos" className="text-gray-900">
            Servicio
          </option>

          {servicios
            .filter(s => s !== "Todos")
            .map((s) => (
              <option key={s} value={s} className="text-gray-900">
                {s}
              </option>
            ))}
        </select>

        {/* FECHA INICIO */}
        <input
          type="date"
          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm"
          value={filters.fechaInicio || ""}
          onChange={(e) =>
            setFilters({ ...filters, fechaInicio: e.target.value })
          }
        />

        {/* FECHA FIN */}
        <input
          type="date"
          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm"
          value={filters.fechaFin || ""}
          onChange={(e) =>
            setFilters({ ...filters, fechaFin: e.target.value })
          }
        />

        {/* DISTRITO */}
        <select
          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm"
          value={filters.distrito}
          onChange={(e) =>
            setFilters({ ...filters, distrito: e.target.value })
          }
        >
          <option value="Todos" className="text-gray-900">
            Distrito
          </option>

          {distritos
            .filter(d => d !== "Todos")
            .map((d) => (
              <option key={d} value={d} className="text-gray-900">
                {d}
              </option>
            ))}
        </select>

      </div>

      {/* LIMPIAR FILTROS */}
      <button
        onClick={() =>
          setFilters({
            servicio: "Todos",
            fechaInicio: null,
            fechaFin: null,
            vendedor: "Todos",
            grupo: "Todos",
            distrito: "Todos",
            canal: "Todos",
            estado: "Todos",
          })
        }
        className="mt-6 bg-white/20 hover:bg-white/30 rounded-lg py-2 text-sm"
      >
        Limpiar filtros
      </button>

    </aside>
  );
}
