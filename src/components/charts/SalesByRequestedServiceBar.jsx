import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SalesByRequestedServiceBar({ data = [] }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const map = {};
    data.forEach(r => {
      const s = r["Servicio Solicitado"] ?? r["Servicio solicitado"];
      if (!s) return;
      map[s] = (map[s] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, ventas]) => ({ name, ventas }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 15);
  }, [data]);

  const h = Math.max(320, chartData.length * 30);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Plan solicitado
      </h3>

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
                width={240}
                tick={{ fontWeight: 600, fontSize: 12, fill: "#374151" }}
              />
              <Tooltip formatter={(value) => [`${value} ventas`, "Total"]} />
              <Bar dataKey="ventas" fill="#1E3A8A" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
