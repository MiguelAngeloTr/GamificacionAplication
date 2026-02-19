// src/components/NotFound/NotFound.jsx
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 text-center">
        <div className="text-6xl font-bold">404</div>
        <h1 className="text-2xl font-semibold mt-2">Página no encontrada</h1>

        <p className="text-sm text-gray-600 mt-3">
          No existe una ruta para{" "}
          <span className="font-mono bg-slate-50 border rounded px-2 py-0.5">
            {location.pathname}
          </span>
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="border rounded px-4 py-2 text-sm hover:bg-slate-50"
          >
            Ir al Dashboard
          </Link>

          <Link
            to="/"
            className="bg-black text-white rounded px-4 py-2 text-sm hover:opacity-90"
          >
            Ir al Login
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Si llegaste aquí por un enlace roto, revisa el menú o las rutas.
        </p>
      </div>
    </div>
  );
}
