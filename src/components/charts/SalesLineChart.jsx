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

// Meses en español
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function parseYYYYMMDD(s) {
  if (!s || typeof s !== "string") return null;
  const parts = s.split("-");
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // ✅ local, sin timezone shift
}

function monthDiffInclusive(start, end) {
  // cantidad de meses cubiertos por el rango (incluye extremos)
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
}

export default function SalesLineChart({ data = [], startDate, endDate }) {
  // startDate / endDate opcional si luego quieres pasarlo desde context
  // Si no los pasas, igual funciona agrupando según el rango detectado dentro de data.

  const { chartData, mode } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { chartData: [], mode: "month" };
    }

    // 1) Detectar rango real usando filtros si existen, si no con min/max del dataset filtrado
    const dates = data
      .map(r => parseYYYYMMDD(r["Fecha Plan/Ejecutada"]))
      .filter(Boolean)
      .sort((a,b) => a - b);

    if (dates.length === 0) return { chartData: [], mode: "month" };

    const start = startDate ? parseYYYYMMDD(startDate) : dates[0];
    const end = endDate ? parseYYYYMMDD(endDate) : dates[dates.length - 1];

    const monthsCovered = monthDiffInclusive(start, end);

    // 2) Si el rango es <= 2 meses → por día
    if (monthsCovered <= 2) {
      const counter = {};

      data.forEach(row => {
        const d = parseYYYYMMDD(row["Fecha Plan/Ejecutada"]);
        if (!d) return;

        // clave YYYY-MM-DD (sin UTC)
        const key =
          `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

        counter[key] = (counter[key] || 0) + 1;
      });

      const daily = Object.entries(counter)
        .map(([fecha, ventas]) => ({ label: fecha, ventas }))
        .sort((a,b) => (a.label > b.label ? 1 : -1));

      return { chartData: daily, mode: "day" };
    }

    // 3) Si es > 2 meses → por mes
    const counter = {};
    data.forEach(row => {
      const d = parseYYYYMMDD(row["Fecha Plan/Ejecutada"]);
      if (!d) return;

      const y = d.getFullYear();
      const m = d.getMonth(); // 0-11
      const key = `${y}-${m}`;

      if (!counter[key]) {
        counter[key] = {
          y,
          m,
          label: `${MONTHS[m]} ${y}`,
          ventas: 0,
        };
      }
      counter[key].ventas += 1;
    });

    const monthly = Object.values(counter).sort(
      (a,b) => a.y - b.y || a.m - b.m
    );

    return { chartData: monthly, mode: "month" };
  }, [data, startDate, endDate]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No hay datos para mostrar en el rango seleccionado
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
            dataKey="label"
            tick={{ fontSize: 12 }}
            minTickGap={mode === "day" ? 30 : 10}
          />

          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

          <Tooltip
            formatter={(value) => [`${value} ventas`, "Total"]}
            labelFormatter={(label) =>
              mode === "day" ? `Fecha: ${label}` : `Mes: ${label}`
            }
          />

          {/* SOMBRA */}
          <Area
            type="monotone"
            dataKey="ventas"
            fill="rgba(30, 58, 138, 0.18)"   // ✅ mismo azul oscuro elegante
            stroke="none"
          />

          {/* LÍNEA CURVA */}
          <Line
            type="monotone"
            dataKey="ventas"
            stroke="#1E3A8A"
            strokeWidth={3}
            dot={mode === "day" ? false : { r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
