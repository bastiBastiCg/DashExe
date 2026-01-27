import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SalesByDistrictBar({ data = [] }) {
  // Sedes dinámicas desde Excel
  const sedes = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map(r => r["Ubic Trabajo Tecnico"])
          .filter(Boolean)
      )
    );
  }, [data]);

  const [activeSede, setActiveSede] = useState(null);

  useEffect(() => {
    if (sedes.length && !activeSede) setActiveSede(sedes[0]);
    // si la sede activa ya no existe tras filtrar, volver a la primera
    if (sedes.length && activeSede && !sedes.includes(activeSede)) setActiveSede(sedes[0]);
  }, [sedes, activeSede]);

  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const counter = {};

    data.forEach(r => {
      if (activeSede && r["Ubic Trabajo Tecnico"] !== activeSede) return;

      const d = r["Distrito"];
      if (!d) return;
      counter[d] = (counter[d] || 0) + 1;
    });

    return Object.entries(counter)
      .map(([name, ventas]) => ({ name, ventas }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 15);
  }, [data, activeSede]);

  const h = Math.max(320, chartData.length * 30);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* TÍTULO */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Ventas por Distrito
      </h3>

      {/* TABS SEDE */}
      <div className="flex gap-2 flex-wrap mb-4">
        {sedes.map((sede) => (
          <button
            key={sede}
            onClick={() => setActiveSede(sede)}
            className={`px-3 py-1 rounded-lg text-sm transition
              ${activeSede === sede
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {sede}
          </button>
        ))}
      </div>

      {/* GRÁFICO */}
      {chartData.length === 0 ? (
        <div className="text-gray-400 text-sm">No hay datos para mostrar</div>
      ) : (
        <div style={{ width: "100%", height: h }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fontWeight: 600, fontSize: 12, fill: "#374151" }}
              />
              <Tooltip
                formatter={(value) => [`${value} ventas`, "Total"]}
              />
              <Bar
                dataKey="ventas"
                fill="#1E3A8A"
                radius={[4, 4, 4, 4]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
