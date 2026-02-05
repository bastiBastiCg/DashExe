import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import { loadExcel } from "../utils/loadExcel";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function PresenterNew() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setRawData } = useData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadState, setUploadState] = useState({ type: "idle", message: "" });
  const [dataset, setDataset] = useState([]);

  const hasDataset = dataset.length > 0;

  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadState({ type: "loading", message: "Procesando Excel..." });
    const data = await loadExcel(file);
    setDataset(data);
    setRawData(data);
    setUploadState({ type: "success", message: "Excel cargado." });
  };

  const dashboardPayload = useMemo(() => JSON.stringify(dataset), [dataset]);

  const handleSaveDashboard = async () => {
    if (!user) return;
    if (!hasDataset) {
      setUploadState({ type: "error", message: "Sube un Excel antes de guardar." });
      return;
    }

    setUploadState({ type: "loading", message: "Guardando dashboard..." });
    const dashboardId = crypto.randomUUID();
    const dataPath = `dashboards/${user.id}/${dashboardId}.json`;

    const { error: uploadError } = await supabase.storage
      .from("dashboard-data")
      .upload(dataPath, new Blob([dashboardPayload], { type: "application/json" }), {
        upsert: true,
      });

    if (uploadError) {
      setUploadState({ type: "error", message: uploadError.message });
      return;
    }

    const { error: insertError } = await supabase.from("dashboards").insert({
      id: dashboardId,
      title: title || "Dashboard sin título",
      description,
      status: "draft",
      created_by: user.id,
      data_path: dataPath,
    });

    if (insertError) {
      setUploadState({ type: "error", message: insertError.message });
      return;
    }

    setUploadState({ type: "success", message: "Dashboard guardado." });
    navigate(`/dashboard/${dashboardId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-muted hover:text-primary"
          >
            ← Volver
          </button>

          <div className="bg-white rounded-xl shadow p-6 border border-black/5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-primary">Nuevo dashboard</h2>
              <p className="text-sm text-muted">
                Sube un Excel, revisa la vista previa y guarda como draft.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="text-muted">Título</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
                  placeholder="Dashboard Comercial"
                />
              </label>
              <label className="text-sm">
                <span className="text-muted">Descripción</span>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
                  placeholder="Indicadores clave y evolución"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUploadExcel}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                📤 Subir Excel
              </button>
              <button
                onClick={handleSaveDashboard}
                disabled={!hasDataset || uploadState.type === "loading"}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                Guardar draft
              </button>
              {uploadState.message ? (
                <span
                  className={`text-xs ${
                    uploadState.type === "error" ? "text-red-600" : "text-muted"
                  }`}
                >
                  {uploadState.message}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <Dashboard />
      </main>
    </div>
  );
}
