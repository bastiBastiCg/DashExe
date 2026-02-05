import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import BrandLogo from "../components/BrandLogo";

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-sm border border-black/5 px-7 py-8 sm:px-8 sm:py-10 space-y-7">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-40 sm:w-44">
            <BrandLogo />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary">Área Comercial</h1>
            <p className="text-sm text-muted">
              Acceso al sistema de dashboards comerciales
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm space-y-2">
            <span className="text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
              placeholder="correo@fiberpro.com"
            />
          </label>

          <label className="block text-sm space-y-2">
            <span className="text-muted">Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
            disabled={status.type === "loading"}
          >
            {status.type === "loading" ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {status.message ? (
          <div
            className={`text-xs rounded-md px-3 py-2 border ${
              status.type === "error"
                ? "text-amber-700 bg-amber-50 border-amber-200"
                : "text-emerald-600 bg-emerald-50 border-emerald-200"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <div className="text-[11px] text-center text-muted pt-1">
          © 2026 FiberPro. Todos los derechos reservados.
          <br />
          Designed by bastiBasti
        </div>
      </div>
    </div>
  );
}
