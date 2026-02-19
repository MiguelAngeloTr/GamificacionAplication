import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaTasks,
  FaFlag,
  FaGraduationCap,
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlus
} from "react-icons/fa";

import { planesApi } from "../../../api/planes.api";
import { actividadesApi } from "../../../api/actividades.api";
import { metasApi } from "../../../api/metas.api";
import { inscripcionesApi } from "../../../api/inscripciones.api";
import { notificacionesApi } from "../../../api/notificaciones.api";

// Helper Card Component
const StatCard = ({ title, count, icon, colorClass, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <span className={`p-2 rounded-full ${colorClass} text-white text-sm`}>{icon}</span>
        {title}
      </h3>
      <span className="text-2xl font-bold text-gray-800">{count}</span>
    </div>
    <div className="text-gray-600 text-sm">
      {children}
    </div>
  </div>
);

// Helper List Item
const ListItem = ({ title, status, date, type }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md mb-2 hover:bg-gray-100 transition-colors border border-gray-100">
    <div>
      <p className="font-medium text-gray-800">{title}</p>
      <div className="text-xs text-gray-500 flex gap-2 items-center">
        {date && <span className="flex items-center gap-1"><FaCalendarAlt size={10} /> {date}</span>}
        {type && <span className="uppercase bg-gray-200 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide">{type}</span>}
      </div>
    </div>
    <div>
      {status === 1 || status === true || status === "completado" ? (
        <span className="text-green-500" title="Completado"><FaCheckCircle /></span>
      ) : (
        <span className="text-yellow-500" title="Pendiente"><FaExclamationCircle /></span>
      )}
    </div>
  </div>
);

export default function DashboardView() {
  const [loading, setLoading] = useState(true);

  const [planes, setPlanes] = useState([]);
  const [planId, setPlanId] = useState("");

  const [actividades, setActividades] = useState([]);
  const [metas, setMetas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  // 1) Cargar planes del usuario (y notificaciones del usuario)
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);

        const [planesRes, notifRes] = await Promise.all([
          planesApi.list(),                 // GET /planes
          notificacionesApi.list({ limit: 50 }), // GET /notificaciones?limit=50

        ]);

        debugger

        if (ignore) return;

        const planesData = Array.isArray(planesRes.data) ? planesRes.data : [];
        setPlanes(planesData);

        // plan por defecto: activo si existe, si no el primero
        const active = planesData.find((p) => p?.activo === 1) || planesData[0];
        setPlanId(active?.id ? String(active.id) : "");

        setNotificaciones(Array.isArray(notifRes.data) ? notifRes.data : []);
      } catch (e) {
        console.error("Error loading dashboard:", e);
        if (!ignore) {
          setPlanes([]);
          setPlanId("");
          setActividades([]);
          setMetas([]);
          setInscripciones([]);
          setNotificaciones([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // 2) Cuando cambia el plan seleccionado, cargar data del plan
  useEffect(() => {
    let ignore = false;

    const loadPlanData = async () => {
      if (!planId) {
        setActividades([]);
        setMetas([]);
        setInscripciones([]);
        return;
      }

      try {
        setLoading(true);

        const [actsRes, metasRes, inscRes] = await Promise.all([
          actividadesApi.list({ planId: Number(planId) }), // GET /actividades?planId=...
          metasApi.list({ planId: Number(planId) }),       // GET /metas?planId=...
          inscripcionesApi.list({ planId: Number(planId) })// GET /inscripciones?planId=...
        ]);

        if (ignore) return;

        setActividades(Array.isArray(actsRes.data) ? actsRes.data : []);
        setMetas(Array.isArray(metasRes.data) ? metasRes.data : []);
        setInscripciones(Array.isArray(inscRes.data) ? inscRes.data : []);
      } catch (e) {
        console.error("Error loading plan data:", e);
        if (!ignore) {
          setActividades([]);
          setMetas([]);
          setInscripciones([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadPlanData();
    return () => {
      ignore = true;
    };
  }, [planId]);

  const selectedPlan = planes.find((p) => String(p.id) === String(planId));

  const handleCreatePlan = () => {
    toast.info("La funcionalidad para crear nuevos planes estará disponible pronto.");
    // Aquí podrías navegar a /planes/nuevo cuando exista la ruta
    // navigate("/planes/nuevo"); 
  };

  if (loading && planes.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-500 h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-lg">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mi Dashboard</h1>
          <p className="text-gray-500 mt-1">Bienvenido a tu panel de control</p>
        </div>

        {/* Selector de Plan */}
        {planes.length > 0 && (
          <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-gray-500 mr-2 font-medium">Plan:</span>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="form-select text-sm border-none focus:ring-0 text-gray-700 font-bold cursor-pointer bg-transparent py-1 outline-none"
            >
              {planes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.activo === 1 ? "(Activo)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {planes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto mt-10">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCalendarAlt className="text-4xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes planes activos</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Para comenzar a ver tu progreso, actividades y metas, necesitas tener un plan de carrera asignado o crear uno nuevo.
          </p>
          <button
            onClick={handleCreatePlan}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="mr-2" />
            Crear Mi Primer Plan
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in-up">

          {/* Plan Info Card */}
          {selectedPlan && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPlan.nombre}</h2>
                  <p className="text-gray-600 mb-4 text-lg">{selectedPlan.descripcion || "Sin descripción disponible"}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedPlan.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {selectedPlan.activo ? "En curso" : "Inactivo"}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="font-semibold">Inicio:</span> {selectedPlan.fecha_inicio || "N/A"}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                  <FaCalendarAlt className="text-blue-500" />
                  <span className="font-semibold">Fin:</span> {selectedPlan.fecha_fin || "N/A"}
                </span>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Actividades" count={actividades.length} icon={<FaTasks />} colorClass="bg-blue-500">
              <span className="text-blue-600 font-medium">{actividades.filter(a => a.estado === 1).length}</span> completadas
            </StatCard>
            <StatCard title="Metas" count={metas.length} icon={<FaFlag />} colorClass="bg-purple-500">
              <span className="text-purple-600 font-medium">{metas.filter(m => m.progreso_pct >= 100).length}</span> alcanzadas
            </StatCard>
            <StatCard title="Cursos" count={inscripciones.length} icon={<FaGraduationCap />} colorClass="bg-orange-500">
              <span className="text-orange-600 font-medium">{inscripciones.filter(i => i.estado === "completado").length}</span> terminados
            </StatCard>
            <StatCard title="Notificaciones" count={notificaciones.length} icon={<FaBell />} colorClass="bg-red-500">
              <span className="text-red-600 font-medium">{notificaciones.filter(n => n.leida === 0).length}</span> sin leer
            </StatCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Actividades List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex justify-between items-center border-b pb-2">
                Actividades Recientes
                <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">Ver todas</span>
              </h3>
              {actividades.length > 0 ? (
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {actividades.slice(0, 5).map(act => (
                    <ListItem
                      key={act.id}
                      title={act.nombre}
                      status={act.estado}
                      date={act.fecha_final || act.fecha_inicio}
                      type={act.tipo}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaTasks className="mx-auto text-3xl mb-2 opacity-30" />
                  <p className="text-sm">No hay actividades registradas en este plan.</p>
                </div>
              )}
            </div>

            {/* Metas List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex justify-between items-center border-b pb-2">
                Metas
                <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">Ver todas</span>
              </h3>
              {metas.length > 0 ? (
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {metas.slice(0, 5).map(meta => (
                    <div key={meta.id} className="mb-4 last:mb-0 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-700">{meta.titulo || "Meta sin título"}</span>
                        <span className="text-purple-600 font-bold">{meta.progreso_pct || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(meta.progreso_pct || 0, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FaFlag className="mx-auto text-3xl mb-2 opacity-30" />
                  <p className="text-sm">No hay metas definidas.</p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Section */}
          {notificaciones.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Últimas Notificaciones</h3>
              <div className="space-y-3">
                {notificaciones.slice(0, 3).map(notif => (
                  <div key={notif.id} className={`p-4 rounded-lg border-l-4 transition-colors ${notif.leida ? 'border-gray-300 bg-gray-50' : 'border-blue-500 bg-blue-50'}`}>
                    <p className="text-sm text-gray-800 font-medium">{notif.mensaje}</p>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-xs text-gray-500">{notif.fecha_creacion}</span>
                      {!notif.leida && <span className="text-xs text-blue-600 font-semibold uppercase">Nueva</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
