import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function PresenterDashboards() {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboards = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("dashboards")
        .select("id, title, description, status, created_at, published_at")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading presenter dashboards:", error);
        setDashboards([]);
      } else {
        setDashboards(data ?? []);
      }
      setLoading(false);
    };

    loadDashboards();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">Panel presenter</h1>
          <p className="text-sm text-muted">Gestiona tus dashboards y publica nuevos.</p>
        </div>
        <Link
          to="/presenter/new"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          Nuevo dashboard
        </Link>
      </header>

      {loading ? <div className="text-sm text-muted">Cargando...</div> : null}

      {!loading && dashboards.length === 0 ? (
        <div className="text-sm text-muted">Aún no has creado dashboards.</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dashboards.map((dashboard) => (
          <Link
            key={dashboard.id}
            to={`/dashboard/${dashboard.id}`}
            className="bg-white rounded-xl shadow p-4 border border-black/5 hover:shadow-md transition"
          >
            <h3 className="text-sm font-semibold text-primary">
              {dashboard.title || "Dashboard sin título"}
            </h3>
            {dashboard.description ? (
              <p className="text-xs text-muted mt-2 line-clamp-3">{dashboard.description}</p>
            ) : null}
            <div className="mt-3 flex items-center gap-2 text-[10px] uppercase">
              <span
                className={`px-2 py-1 rounded-full ${
                  dashboard.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {dashboard.status}
              </span>
              {dashboard.published_at ? (
                <span className="text-muted">Publicado {new Date(dashboard.published_at).toLocaleDateString()}</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
