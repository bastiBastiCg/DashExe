import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import Sidebar from "../components/Sidebar";
import { useData } from "../context/DataContext";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function DashboardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setRawData, resetFilters } = useData();
  const { role, user } = useAuth();
  const [dashboardMeta, setDashboardMeta] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    const loadDashboard = async () => {
      setStatus({ type: "loading", message: "Cargando dashboard..." });
      const { data, error } = await supabase
        .from("dashboards")
        .select("id, title, description, status, created_by, data_path, published_at")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setStatus({ type: "error", message: "No se encontró el dashboard." });
        return;
      }

      setDashboardMeta(data);
      if (!data.data_path) {
        setRawData([]);
        setStatus({ type: "error", message: "Este dashboard no tiene datos." });
        return;
      }

      const { data: fileData, error: fileError } = await supabase.storage
        .from("dashboard-data")
        .download(data.data_path);

      if (fileError) {
        console.error("Error downloading data:", fileError);
        setStatus({ type: "error", message: "No se pudo descargar el dataset." });
        return;
      }

      const text = await fileData.text();
      try {
        const json = JSON.parse(text);
        resetFilters();
        setRawData(Array.isArray(json) ? json : []);
        setStatus({ type: "success", message: "" });
      } catch (parseError) {
        console.error("Error parsing dashboard JSON:", parseError);
        setStatus({ type: "error", message: "Dataset inválido." });
      }
    };

    loadDashboard();
  }, [id, resetFilters, setRawData]);

  const canPublish =
    role === "presenter" && dashboardMeta?.created_by === user?.id;

  const canAdminPublish = role === "admin";

  const handlePublish = async () => {
    if (!dashboardMeta) return;
    setStatus({ type: "loading", message: "Publicando..." });
    const { error } = await supabase
      .from("dashboards")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", dashboardMeta.id);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setDashboardMeta({ ...dashboardMeta, status: "published" });
    setStatus({ type: "success", message: "Dashboard publicado." });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-muted hover:text-primary"
          >
            ← Volver
          </button>

          {dashboardMeta ? (
            <div className="bg-white rounded-xl border border-black/5 p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-primary">
                  {dashboardMeta.title || "Dashboard sin título"}
                </h2>
                {dashboardMeta.description ? (
                  <p className="text-sm text-muted mt-1">{dashboardMeta.description}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-muted">
                  Estado: {dashboardMeta.status}
                </span>
                {dashboardMeta.status !== "published" && (canPublish || canAdminPublish) ? (
                  <button
                    onClick={handlePublish}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                  >
                    Publicar
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {status.type === "error" ? (
            <div className="text-sm text-red-600">{status.message}</div>
          ) : null}
        </div>

        <Dashboard />
      </main>
    </div>
  );
}
