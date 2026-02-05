import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const roleOptions = ["admin", "presenter", "viewer"];

export default function AdminUsers() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading profiles:", error);
      setProfiles([]);
    } else {
      setProfiles(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Creando usuario..." });
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { email, password, role },
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    if (data?.error) {
      setStatus({ type: "error", message: data.error });
      return;
    }

    setStatus({ type: "success", message: "Usuario creado correctamente." });
    setEmail("");
    setPassword("");
    setRole("viewer");
    loadProfiles();
  };

  const handleRoleChange = async (profileId, nextRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: nextRole })
      .eq("id", profileId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: "Rol actualizado." });
    loadProfiles();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-primary">Administración de usuarios</h1>
        <p className="text-sm text-muted">Crea usuarios y asigna roles.</p>
      </header>

      <form
        onSubmit={handleCreateUser}
        className="bg-white rounded-xl shadow p-6 border border-black/5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm">
            <span className="text-muted">Correo</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
              placeholder="usuario@empresa.com"
              required
              type="email"
            />
          </label>
          <label className="text-sm">
            <span className="text-muted">Contraseña temporal</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
              placeholder="Temporal123"
              required
              type="text"
            />
          </label>
          <label className="text-sm">
            <span className="text-muted">Rol</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          Crear usuario
        </button>

        {status.message ? (
          <div
            className={`text-xs ${
              status.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {status.message}
          </div>
        ) : null}
      </form>

      <section className="bg-white rounded-xl shadow p-6 border border-black/5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-primary">Perfiles existentes</h2>
          <p className="text-xs text-muted">Listado basado en la tabla profiles.</p>
        </div>

        {loading ? <div className="text-sm text-muted">Cargando...</div> : null}

        {!loading && profiles.length === 0 ? (
          <div className="text-sm text-muted">No hay perfiles disponibles.</div>
        ) : null}

        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-black/5 rounded-lg px-3 py-2 text-xs"
            >
              <div>
                <div className="font-medium text-primary">{profile.id}</div>
                <div className="text-muted">
                  Creado: {new Date(profile.created_at).toLocaleString()}
                </div>
              </div>
              <select
                value={profile.role}
                onChange={(event) => handleRoleChange(profile.id, event.target.value)}
                className="h-8 rounded-md border border-black/10 px-2 text-xs"
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
