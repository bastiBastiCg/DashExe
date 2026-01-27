import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";
import { useMemo } from "react";
import { useData } from "../../context/DataContext";

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export default function SalesLineChart() {
  const { filteredData } = useData();

  const chartData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const counter = {};

    filteredData.forEach(row => {
      const rawDate = row["Fecha Plan/Ejecutada"];
      if (!rawDate || typeof rawDate !== "string") return;

      // ✅ FIX DEFINITIVO DE TIMEZONE
      // Espera formato: YYYY-MM-DD
      const parts = rawDate.split("-");
      if (parts.length !== 3) return;

      const year = Number(parts[0]);
      const month = Number(parts[1]); // 1–12

      if (!year || !month) return;

      const key = `${year}-${month}`;

      if (!counter[key]) {
        counter[key] = {
          year,
          month,
          mes: `${MONTHS[month - 1]} ${year}`,
          ventas: 0,
        };
      }

      // Cada fila = 1 venta
      counter[key].ventas += 1;
    });

    // Orden cronológico real
    return Object.values(counter).sort(
      (a, b) => a.year - b.year || a.month - b.month
    );
  }, [filteredData]);

  if (chartData.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="w-full h-[340px]">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="mes"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={value => [`${value} ventas`, "Total"]}
          />

          {/* ÁREA SOMBREADA */}
          <Area
            type="monotone"
            dataKey="ventas"
            fill="rgba(37, 99, 235, 0.18)"
            stroke="none"
          />

          {/* LÍNEA CURVA */}
          <Line
            type="monotone"
            dataKey="ventas"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
