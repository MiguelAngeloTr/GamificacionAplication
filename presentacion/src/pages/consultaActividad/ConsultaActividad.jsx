// src/pages/consultaActividad/ConsultaActividad.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { actividadesApi } from "../../api/actividades.api";

export default function ConsultaActividad() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isDetail = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);

  // ---- MOCK: colaboradores y sus actividades (para Coach) ----
  const [selectedColabId, setSelectedColabId] = useState("c1");

  const colaboradoresMock = useMemo(
    () => [
      { id: "c1", nombre: "Colaborador A", rol: "Colaborador", plan: "Plan Carrera", progreso: 64 },
      { id: "c2", nombre: "Colaborador B", rol: "Colaborador", plan: "Plan Carrera", progreso: 38 },
      { id: "c3", nombre: "Colaborador C", rol: "Colaborador", plan: "Onboarding", progreso: 82 },
    ],
    []
  );

  const actividadesColabMock = useMemo(
    () => ({
      c1: [
        { id: 101, nombre: "Práctica SQL (Joins)", tipo: "practica", estado: 0, fecha: "2026-01-18" },
        { id: 102, nombre: "Entrega evidencias Sprint 2", tipo: "seguimiento", estado: 0, fecha: "2026-01-20" },
        { id: 103, nombre: "Curso SQL - módulo 1", tipo: "curso", estado: 1, fecha: "2026-01-15" },
      ],
      c2: [
        { id: 201, nombre: "Revisión semanal con coach", tipo: "seguimiento", estado: 0, fecha: "2026-01-19" },
        { id: 202, nombre: "Curso liderazgo", tipo: "curso", estado: 0, fecha: "2026-01-23" },
      ],
      c3: [
        { id: 301, nombre: "Onboarding seguridad", tipo: "curso", estado: 1, fecha: "2026-01-10" },
        { id: 302, nombre: "Checklist herramientas", tipo: "tarea", estado: 1, fecha: "2026-01-12" },
        { id: 303, nombre: "Entrega primer sprint", tipo: "tarea", estado: 0, fecha: "2026-01-21" },
      ],
    }),
    []
  );

  const colabSelected = useMemo(
    () => colaboradoresMock.find((c) => c.id === selectedColabId) ?? colaboradoresMock[0],
    [colaboradoresMock, selectedColabId]
  );

  const colabActs = useMemo(() => {
    const list = actividadesColabMock[selectedColabId] ?? [];
    return list;
  }, [actividadesColabMock, selectedColabId]);

  const colabStats = useMemo(() => {
    const total = colabActs.length;
    const done = colabActs.filter((a) => a.estado === 1).length;
    const pending = colabActs.filter((a) => a.estado === 0).length;
    const progress = total ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, progress };
  }, [colabActs]);

  // ----------------------------------------------------------

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      if (isDetail) {
        const { data } = await actividadesApi.getById(id);
        setItem(data);
      } else {
        // Lista (del usuario autenticado)
        const { data } = await actividadesApi.listMine();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo cargar la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const estadoLabel = (estado) => {
    if (estado === 0) return "Pendiente";
    if (estado === 1) return "Completada";
    return String(estado ?? "-");
  };

  const handleNew = () => navigate("/nueva");
  const handleBack = () => navigate("/consultaActividad");
  const handleEdit = (activityId) => navigate(`/edit/${activityId}`);

  const handleDelete = async (activityId) => {
    const ok = window.confirm("¿Eliminar esta actividad?");
    if (!ok) return;

    try {
      await actividadesApi.remove(activityId);
      if (isDetail) {
        navigate("/consultaActividad", { replace: true });
      } else {
        load();
      }
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">
          {isDetail ? "Detalle de actividad" : "Consulta de actividades"}
        </h1>
        <div className="bg-white border rounded-xl p-4">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold">
            {isDetail ? "Detalle de actividad" : "Consulta de actividades"}
          </h1>
          <p className="text-sm text-gray-500">
            {isDetail
              ? `Mostrando actividad con id: ${id}`
              : "Listado general de actividades (tu usuario)"}
          </p>
        </div>

        <div className="flex gap-2">
          {isDetail ? (
            <button
              className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
              onClick={handleBack}
            >
              Volver
            </button>
          ) : null}

          <button
            className="bg-black text-white rounded px-3 py-2 text-sm hover:opacity-90"
            onClick={handleNew}
          >
            + Nueva
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
          {error}
        </div>
      ) : null}

      {/* Detalle */}
      {isDetail ? (
        <div className="bg-white border rounded-xl p-4">
          {!item ? (
            <p className="text-sm text-gray-600">No hay datos para mostrar.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{item.nombre}</h2>
                  <p className="text-sm text-gray-500">
                    Estado: <span className="font-medium">{estadoLabel(item.estado)}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => handleEdit(item.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="border border-red-300 text-red-700 rounded px-3 py-2 text-sm hover:bg-red-50"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {item.descripcion ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Descripción</p>
                  <p className="text-sm text-gray-700">{item.descripcion}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Tipo</p>
                  <p className="text-sm text-gray-800">{item.tipo ?? "-"}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Usuario</p>
                  <p className="text-sm text-gray-800">{item.usuario_id ?? "-"}</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Fecha inicio</p>
                  <p className="text-sm text-gray-800">
                    {item.fecha_inicio ? String(item.fecha_inicio).slice(0, 10) : "-"}
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-gray-500">Fecha final</p>
                  <p className="text-sm text-gray-800">
                    {item.fecha_final ? String(item.fecha_final).slice(0, 10) : "-"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Lista */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total: <span className="font-medium">{items.length}</span>
              </p>
              <button
                className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
                onClick={load}
              >
                Recargar
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-4">
                <p className="text-sm text-gray-600">No hay actividades registradas.</p>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((a) => (
                  <div key={a.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{a.nombre}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {a.tipo ?? "-"} • {estadoLabel(a.estado)} •{" "}
                        {a.fecha_inicio ? String(a.fecha_inicio).slice(0, 10) : "-"}
                      </p>
                      {a.descripcion ? (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {a.descripcion}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <button
                        className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => navigate(`/consultaActividad/${a.id}`)}
                      >
                        Ver
                      </button>
                      <button
                        className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => handleEdit(a.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="border border-red-300 text-red-700 rounded px-3 py-2 text-sm hover:bg-red-50"
                        onClick={() => handleDelete(a.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MOCKUP: Vista Coach - Colaboradores y actividades */}
          <div className="mt-6 bg-white border rounded-xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Coach • Colaboradores asignados
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  (Boceto) Aquí luego conectamos al backend para listar colaboradores del coach y sus actividades.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="border rounded px-3 py-2 text-sm hover:bg-slate-50">
                  Exportar
                </button>
                <button className="border rounded px-3 py-2 text-sm hover:bg-slate-50">
                  Filtros
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Colaboradores */}
              <div className="border-r">
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-600 mb-3">
                    Selecciona un colaborador
                  </p>

                  <div className="space-y-2">
                    {colaboradoresMock.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColabId(c.id)}
                        className={[
                          "w-full text-left border rounded-xl px-3 py-3 hover:bg-slate-50 transition",
                          selectedColabId === c.id ? "border-black bg-slate-50" : "border-slate-200 bg-white",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{c.nombre}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {c.rol} • {c.plan}
                            </p>
                          </div>
                          <span className="text-xs text-gray-700">{c.progreso}%</span>
                        </div>

                        <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full" style={{ width: `${c.progreso}%`, background: "black" }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detalle colaborador */}
              <div className="lg:col-span-2 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {colabSelected?.nombre ?? "Colaborador"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Plan: {colabSelected?.plan ?? "-"} • Progreso: {colabStats.progress}%
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="border rounded px-3 py-2 text-sm hover:bg-slate-50">
                      Ver perfil
                    </button>
                    <button className="border rounded px-3 py-2 text-sm hover:bg-slate-50">
                      Enviar mensaje
                    </button>
                  </div>
                </div>

                {/* KPIs del colaborador */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <MiniStat label="Total" value={colabStats.total} />
                  <MiniStat label="Pendientes" value={colabStats.pending} />
                  <MiniStat label="Completadas" value={colabStats.done} />
                </div>

                {/* Tabla de actividades del colaborador */}
                <div className="mt-4 border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 px-4 py-3 bg-slate-50 text-xs text-gray-600">
                    <div className="col-span-7">Actividad</div>
                    <div className="col-span-2">Tipo</div>
                    <div className="col-span-2">Fecha</div>
                    <div className="col-span-1 text-right">Estado</div>
                  </div>

                  {colabActs.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">Sin actividades.</div>
                  ) : (
                    <div className="divide-y">
                      {colabActs.map((a) => (
                        <div key={a.id} className="grid grid-cols-12 px-4 py-3 text-sm items-center">
                          <div className="col-span-7">
                            <p className="font-medium text-gray-900">{a.nombre}</p>
                            <p className="text-xs text-gray-500">
                              (Mock) Luego: actividadesApi.listByColaborador(colabId)
                            </p>
                          </div>
                          <div className="col-span-2 text-gray-700">{a.tipo}</div>
                          <div className="col-span-2 text-gray-700">{a.fecha}</div>
                          <div className="col-span-1 text-right">
                            <span
                              className={[
                                "text-[11px] px-2 py-1 rounded-full border",
                                a.estado === 1
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700",
                              ].join(" ")}
                            >
                              {a.estado === 1 ? "OK" : "P"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Conexión futura sugerida:{" "}
                  <span className="font-medium">coachesApi.getColaboradores()</span> y{" "}
                  <span className="font-medium">actividadesApi.listByUser(userId)</span>.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="border rounded-xl p-3 bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
