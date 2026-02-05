import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function PublishedDashboards() {
  const { role, user } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboards = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dashboards")
        .select("id, title, description, status, created_by, created_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error loading dashboards:", error);
        setDashboards([]);
      } else {
        setDashboards(data ?? []);
      }
      setLoading(false);
    };

    loadDashboards();
  }, []);

  const showPresenterLink = role === "presenter" || role === "admin";
  const showAdminLink = role === "admin";

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-primary">Dashboards publicados</h1>
          <p className="text-sm text-muted">
            Bienvenido{user ? `, ${user.email}` : ""}. Selecciona un dashboard para visualizar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showPresenterLink ? (
            <Link
              to="/presenter"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Panel presenter
            </Link>
          ) : null}
          {showAdminLink ? (
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-black"
            >
              Admin usuarios
            </Link>
          ) : null}
        </div>
      </header>

      {loading ? (
        <div className="text-sm text-muted">Cargando dashboards...</div>
      ) : null}

      {!loading && dashboards.length === 0 ? (
        <div className="text-sm text-muted">No hay dashboards publicados todavía.</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dashboards.map((dashboard) => (
          <Link
            key={dashboard.id}
            to={`/dashboard/${dashboard.id}`}
            className="bg-white rounded-xl shadow p-4 border border-black/5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-primary">
                  {dashboard.title || "Dashboard sin título"}
                </h3>
                <p className="text-xs text-muted mt-1">
                  Publicado:{" "}
                  {dashboard.published_at
                    ? new Date(dashboard.published_at).toLocaleString()
                    : "Sin fecha"}
                </p>
              </div>
              <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Published
              </span>
            </div>
            {dashboard.description ? (
              <p className="text-xs text-muted mt-3 line-clamp-3">{dashboard.description}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
