import Header from "../components/Header";
import KPICard from "../components/KPICard";
import VendorBar from "../components/charts/VendorBar";
import DistrictDonut from "../components/charts/DistrictDonut";
import SalesLineChart from "../components/charts/SalesLineChart";
import { useData } from "../context/DataContext";

import SalesByDistrictBar from "../components/charts/SalesByDistrictBar";
import SalesByRequestedServiceBar from "../components/charts/SalesByRequestedServiceBar";
import InstallsByTechBar from "../components/charts/InstallsByTechBar";

export default function Dashboard() {
  const { filteredData } = useData();

  const totalVentas = filteredData.length;

  const clientesActivos = filteredData.filter(
    (row) => row["Estado Sus"]?.toUpperCase() === "ACTIVO"
  ).length;

  const ventasExternas = filteredData.filter((row) =>
    row["Grupo de comision"]?.toUpperCase().includes("EXTERNO")
  ).length;

  const porcentajeExternas = totalVentas
    ? `${((ventasExternas / totalVentas) * 100).toFixed(1)}%`
    : "0%";

  return (
    <div className="p-6 space-y-8">
      <Header />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Ventas Totales" value={totalVentas} />
        <KPICard title="Clientes Activos" value={clientesActivos} />
        <KPICard title="% Ventas Externas" value={porcentajeExternas} />
      </div>

      {/* GRÁFICOS PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistrictDonut data={filteredData} />
        <VendorBar data={filteredData} />
      </div>

      {/* EVOLUCIÓN */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[300px] border border-black/5">
        <h3 className="text-sm font-semibold text-primary mb-4">
          Evolución de Ventas
        </h3>
        <SalesLineChart data={filteredData} />
      </div>

      {/* NUEVOS GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByDistrictBar data={filteredData} />
        <SalesByRequestedServiceBar data={filteredData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InstallsByTechBar data={filteredData} />
      </div>
    </div>
  );
}
