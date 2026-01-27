import { createContext, useContext, useState, useMemo } from "react";

const DataContext = createContext();

function parseDateYYYYMMDD(s) {
  if (!s || typeof s !== "string") return null;
  const parts = s.split("-");
  if (parts.length !== 3) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // ✅ local, sin UTC shift
}

export function DataProvider({ children }) {
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState({
    servicio: "Todos",
    fechaInicio: null,
    fechaFin: null,
    vendedor: "Todos",
    grupo: "Todos",
    distrito: "Todos",
  });

  const filteredData = useMemo(() => {
    const start = filters.fechaInicio ? parseDateYYYYMMDD(filters.fechaInicio) : null;
    const end = filters.fechaFin ? parseDateYYYYMMDD(filters.fechaFin) : null;

    return rawData.filter((row) => {
      // Servicio
      if (filters.servicio !== "Todos" && row["Servicio"] !== filters.servicio) return false;

      // Distrito
      if (filters.distrito !== "Todos" && row["Distrito"] !== filters.distrito) return false;

      // Fechas (Excel)
      if (start || end) {
        const rowDate = parseDateYYYYMMDD(row["Fecha Plan/Ejecutada"]);
        if (!rowDate) return false;

        if (start && rowDate < start) return false;
        if (end && rowDate > end) return false;
      }

      return true;
    });
  }, [rawData, filters]);

  return (
    <DataContext.Provider value={{ rawData, setRawData, filters, setFilters, filteredData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
