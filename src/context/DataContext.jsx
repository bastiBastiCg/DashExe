import { createContext, useContext, useState, useMemo } from "react";


const DataContext = createContext();


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
return rawData.filter((row) => {
if (filters.servicio !== "Todos" && row.Servicio !== filters.servicio) return false;
if (filters.vendedor !== "Todos" && row.Vendedor !== filters.vendedor) return false;
if (filters.grupo !== "Todos" && row.Grupo !== filters.grupo) return false;
if (filters.distrito !== "Todos" && row.Distrito !== filters.distrito) return false;


if (filters.fechaInicio && new Date(row.Fecha) < new Date(filters.fechaInicio)) return false;
if (filters.fechaFin && new Date(row.Fecha) > new Date(filters.fechaFin)) return false;


return true;
});
}, [rawData, filters]);


return (
<DataContext.Provider
value={{
rawData,
setRawData,
filters,
setFilters,
filteredData,
}}
>
{children}
</DataContext.Provider>
);
}


export const useData = () => useContext(DataContext);