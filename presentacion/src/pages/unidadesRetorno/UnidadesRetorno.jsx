// src/pages/unidadesRetorno/UnidadesRetorno.jsx
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

/**
 * MOCK de rol (luego viene de useAuth / useProfile)
 * Cambia a "COLABORADOR" para probar
 */
const MOCK_ROLE = "COACH"; // "COACH" | "COLABORADOR"
const MOCK_USER_ID = 10;   // id del usuario autenticado

export default function UnidadesRetorno() {
  /** ---------------- MOCK DATA ---------------- */

  const unidadesMock = useMemo(
    () => [
      // Unidades del coach
      {
        id: 1,
        titulo: "Plan de mejora Sprint 1",
        estado: 1,
        usuario_id: 10,
        coach_id: null,
        owner: "Yo (Coach)",
      },
      // Unidades de colaboradores
      {
        id: 2,
        titulo: "Retroalimentación SQL",
        estado: 0,
        usuario_id: 21,
        coach_id: 10,
        owner: "Colaborador A",
      },
      {
        id: 3,
        titulo: "Unidad liderazgo",
        estado: 2,
        usuario_id: 22,
        coach_id: 10,
        owner: "Colaborador B",
      },
    ],
    []
  );

  /** ---------------- FILTROS DE NEGOCIO ---------------- */

  const misUnidades = useMemo(
    () => unidadesMock.filter((u) => u.usuario_id === MOCK_USER_ID),
    [unidadesMock]
  );

  const unidadesColaboradores = useMemo(
    () =>
      unidadesMock.filter(
        (u) => u.coach_id === MOCK_USER_ID && u.usuario_id !== MOCK_USER_ID
      ),
    [unidadesMock]
  );

  /** ---------------- ACCIONES MOCK ---------------- */

  const validarUnidad = (id) => {
    alert(`(Mock) Unidad ${id} VALIDADA`);
    // luego: unidadesApi.validate(id)
  };

  const rechazarUnidad = (id) => {
    alert(`(Mock) Unidad ${id} RECHAZADA`);
    // luego: unidadesApi.reject(id)
  };

  const estadoLabel = (estado) => {
    if (estado === 0) return "Pendiente";
    if (estado === 1) return "Validada";
    if (estado === 2) return "Rechazada";
    return "-";
  };

  const estadoStyle = (estado) => {
    if (estado === 1) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (estado === 2) return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  /** ---------------- UI ---------------- */

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Unidades de retorno</h1>
          <p className="text-sm text-gray-500">
            Seguimiento y validación de unidades
          </p>
        </div>

        <Link
          className="bg-black text-white rounded px-4 py-2 text-sm"
          to="/edit/unit/new"
        >
          Nueva unidad
        </Link>
      </div>

      {/* ================= MIS UNIDADES ================= */}
      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-semibold mb-3">Mis unidades</h2>

        {misUnidades.length === 0 ? (
          <p className="text-sm text-gray-600">No has creado unidades.</p>
        ) : (
          <div className="divide-y">
            {misUnidades.map((u) => (
              <div
                key={u.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{u.titulo}</p>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded border ${estadoStyle(
                      u.estado
                    )}`}
                  >
                    {estadoLabel(u.estado)}
                  </span>
                </div>

                <Link
                  to={`/edit/unit/${u.id}`}
                  className="text-sm underline"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= COACH: COLABORADORES ================= */}
      {MOCK_ROLE === "COACH" && (
        <section className="bg-white border rounded-xl p-4">
          <h2 className="text-base font-semibold mb-3">
            Unidades de colaboradores
          </h2>

          <p className="text-xs text-gray-500 mb-4">
            (Mock) Aquí el coach valida unidades de sus colaboradores
          </p>

          {unidadesColaboradores.length === 0 ? (
            <p className="text-sm text-gray-600">
              No hay unidades pendientes de colaboradores.
            </p>
          ) : (
            <div className="divide-y">
              {unidadesColaboradores.map((u) => (
                <div
                  key={u.id}
                  className="py-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{u.titulo}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Autor: {u.owner}
                    </p>
                    <span
                      className={`inline-block mt-2 text-xs px-2 py-1 rounded border ${estadoStyle(
                        u.estado
                      )}`}
                    >
                      {estadoLabel(u.estado)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="border rounded px-3 py-1.5 text-sm hover:bg-slate-50"
                      onClick={() => validarUnidad(u.id)}
                      disabled={u.estado !== 0}
                    >
                      Validar
                    </button>
                    <button
                      className="border border-red-300 text-red-700 rounded px-3 py-1.5 text-sm hover:bg-red-50"
                      onClick={() => rechazarUnidad(u.id)}
                      disabled={u.estado !== 0}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
