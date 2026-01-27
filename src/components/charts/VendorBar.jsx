import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

export default function VendorBar({ data = [] }) {
  const groups = useMemo(() => {
    return Array.from(
      new Set(
        data.map((r) => r["Grupo de comision"]).filter(Boolean)
      )
    );
  }, [data]);

  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    if (groups.length && !activeGroup) setActiveGroup(groups[0]);
    if (groups.length && activeGroup && !groups.includes(activeGroup)) setActiveGroup(groups[0]);
  }, [groups, activeGroup]);

  const chartData = useMemo(() => {
    if (!activeGroup) return [];

    const counter = {};
    data.forEach((row) => {
      if (row["Grupo de comision"] !== activeGroup) return;
      const vendedor = row["Vendedor"];
      if (!vendedor) return;
      counter[vendedor] = (counter[vendedor] || 0) + 1;
    });

    // Con reversed para que mayor quede arriba, orden menor->mayor y slice final
    return Object.entries(counter)
      .map(([name, ventas]) => ({ name, ventas }))
      .sort((a, b) => a.ventas - b.ventas)
      .slice(-20);
  }, [data, activeGroup]);

  const chartHeight = Math.max(320, chartData.length * 32);

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-black/5">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Desempeño Comercial
      </h3>

      <div className="flex gap-2 flex-wrap mb-4">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition
              ${
                activeGroup === group
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {group}
          </button>
        ))}
      </div>

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
              margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={190}
                reversed
                tick={{ fontWeight: 600, fontSize: 12, fill: "#374151" }}
              />
              <Tooltip formatter={(v) => [`${v} ventas`, "Total"]} />
              <Bar dataKey="ventas" fill="#1E3A8A" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
