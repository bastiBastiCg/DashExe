import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

export default function VendorBar({ data = [] }) {
  /* ============================
     1️⃣ GRUPOS DINÁMICOS
  ============================ */
  const groups = useMemo(() => {
    return Array.from(
      new Set(
        data
          .map(r => r["Grupo de comision"])
          .filter(Boolean)
      )
    );
  }, [data]);

  /* ============================
     2️⃣ GRUPO ACTIVO
  ============================ */
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    if (groups.length && !activeGroup) {
      setActiveGroup(groups[0]);
    }
  }, [groups, activeGroup]);

  /* ============================
     3️⃣ DATA PROCESADA
  ============================ */
  const chartData = useMemo(() => {
    if (!activeGroup) return [];

    const counter = {};

    data.forEach(row => {
      if (row["Grupo de comision"] !== activeGroup) return;

      const vendedor = row["Vendedor"];
      if (!vendedor) return;

      counter[vendedor] = (counter[vendedor] || 0) + 1;
    });

    // 🔥 MENOR → MAYOR (porque usamos reversed)
    return Object.entries(counter)
      .map(([name, ventas]) => ({ name, ventas }))
      .sort((a, b) => a.ventas - b.ventas)
      .slice(-20); // TOP 20
  }, [data, activeGroup]);

  /* ============================
     4️⃣ ALTURA DINÁMICA
  ============================ */
  const chartHeight = Math.max(320, chartData.length * 32);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* TÍTULO */}
      <h3 className="text-lg font-semibold mb-3">
        Desempeño Comercial
      </h3>

      {/* FILTROS */}
      <div className="flex gap-2 flex-wrap mb-4">
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-3 py-1 rounded-lg text-sm transition
              ${
                activeGroup === group
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* GRÁFICO */}
      {chartData.length === 0 ? (
        <div className="text-gray-400 text-sm">
          No hay datos para este grupo
        </div>
      ) : (
        <div style={{ width: "100%", height: chartHeight }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, bottom: 10, left: 40, right: 20 }}
            >
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={180}
                reversed   // 🔑 CLAVE
              />
              <Tooltip />
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
