import Header from "../components/Header";
import KPICard from "../components/KPICard";
import VendorBar from "../components/charts/VendorBar";
import DistrictDonut from "../components/charts/DistrictDonut";
import SalesLineChart from "../components/charts/SalesLineChart";
import UploadExcel from "../components/UploadExcel";
import { useData } from "../context/DataContext";

export default function Dashboard() {
  const { filteredData } = useData();

  // ======================
  // KPIs
  // ======================
  const totalVentas = filteredData.length;

  const clientesActivos = filteredData.filter(
    row => row["Estado Sus"]?.toUpperCase() === "ACTIVO"
  ).length;

  const ventasExternas = filteredData.filter(
    row =>
      row["Grupo de comision"]
        ?.toUpperCase()
        .includes("EXTERNO")
  ).length;

  const porcentajeExternas = totalVentas
    ? `${((ventasExternas / totalVentas) * 100).toFixed(1)}%`
    : "0%";

  return (
    <div className="p-6 space-y-6">
      {/* SUBIR EXCEL */}
      <UploadExcel />

      <Header />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Ventas Totales"
          value={totalVentas}
        />

        <KPICard
          title="Clientes Activos"
          value={clientesActivos}
        />

        <KPICard
          title="% Ventas Externas"
          value={porcentajeExternas}
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistrictDonut data={filteredData} />
        {/* 👇 NO TOCAR: así VendorBar funciona bien */}
        <VendorBar data={filteredData} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
        <h3 className="font-semibold mb-4">Evolución de Ventas</h3>
        <SalesLineChart data={filteredData} />
      </div>
    </div>
  );
}
