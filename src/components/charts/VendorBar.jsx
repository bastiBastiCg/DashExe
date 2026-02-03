import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

const COLORS = [
  "#1E3A8A",
  "#2563EB",
  "#0EA5E9",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

// Label con porcentaje + cantidad
const renderLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  percent,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#111827"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {name} — {(percent * 100).toFixed(1)}% ({value})
    </text>
  );
};

export default function VendorBar({ data = [] }) {
  const donutData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const conteo = {};
    data.forEach((row) => {
      const grupo = row["Grupo de comision"];
      if (!grupo) return;
      conteo[grupo] = (conteo[grupo] || 0) + 1;
    });

    // Ordena desc y si quieres limita a top N (opcional)
    return Object.entries(conteo)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (donutData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border border-black/5">
        <h3 className="text-sm font-semibold text-primary mb-3">
          Desempeño Comercial
        </h3>
        <p className="text-gray-400 text-sm">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-black/5">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Desempeño Comercial
      </h3>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={donutData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              labelLine
              label={renderLabel}
            >
              {donutData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) => [
                `${(props.payload.percent * 100).toFixed(1)}% (${value})`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-4 space-y-2">
        {donutData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center text-sm font-semibold text-gray-700"
          >
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
