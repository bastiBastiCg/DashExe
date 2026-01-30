import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Iniciando sesión..." });

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: "Sesión iniciada." });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-6 border border-black/5">
        <div>
          <h1 className="text-xl font-semibold text-primary">Acceso</h1>
          <p className="text-sm text-muted">Ingresa con tu correo y contraseña.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="text-muted">Correo</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
              placeholder="correo@empresa.com"
            />
          </label>

          <label className="block text-sm">
            <span className="text-muted">Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full h-10 rounded-lg border border-black/10 px-3 text-sm"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {status.message ? (
          <div
            className={`text-xs ${
              status.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {status.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
