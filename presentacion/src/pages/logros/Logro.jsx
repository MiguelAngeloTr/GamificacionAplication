// src/pages/logros/Logro.jsx
import { useMemo, useState } from "react";

export default function Logro() {
  // Boceto UI (sin backend). Luego reemplazas estas constantes con gamificacionApi.getRewards()/getPoints().
  const [tab, setTab] = useState("recompensas"); // recompensas | puntos | ranking

  const kpis = useMemo(
    () => ({
      totalPuntos: 1280,
      nivel: 7,
      racha: 5,
      insignias: 12,
    }),
    []
  );

  const rewardsMock = useMemo(
    () => [
      { id: 1, nombre: "Insignia SQL Starter", descripcion: "Completa 3 prácticas de SQL.", estado: "Desbloqueada" },
      { id: 2, nombre: "Racha 7 días", descripcion: "Registra actividad 7 días seguidos.", estado: "En progreso" },
      { id: 3, nombre: "Coach Approved", descripcion: "Validación de evidencia por coach.", estado: "Bloqueada" },
    ],
    []
  );

  const pointsMock = useMemo(
    () => [
      { id: 1, nombre: "Actividad completada", puntos: 30 },
      { id: 2, nombre: "Evidencia validada", puntos: 80 },
      { id: 3, nombre: "Racha semanal", puntos: 120 },
    ],
    []
  );

  const rankingMock = useMemo(
    () => [
      { id: 1, nombre: "Usuario A", puntos: 1520, badge: "Platinum" },
      { id: 2, nombre: "Usuario B", puntos: 1310, badge: "Gold" },
      { id: 3, nombre: "Tú", puntos: 1280, badge: "Gold" },
    ],
    []
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Logros</h1>
          <p className="text-sm text-slate-300">
            Boceto visual del módulo de gamificación. Luego conectamos a backend.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm rounded-lg border border-white/10 text-slate-200 hover:bg-white/5">
            Ver historial
          </button>
          <button className="px-3 py-2 text-sm rounded-lg bg-white/10 text-slate-100 hover:bg-white/15 border border-white/10">
            Sincronizar
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: KPIs */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-slate-300">Resumen</p>
              <span className="text-xs text-slate-400">v0 (mock)</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Kpi title="Puntos" value={kpis.totalPuntos} hint="Acumulados" accent="cyan" />
              <Kpi title="Nivel" value={`N${kpis.nivel}`} hint="Progreso" accent="violet" />
              <Kpi title="Racha" value={`${kpis.racha}d`} hint="Días seguidos" accent="amber" />
              <Kpi title="Insignias" value={kpis.insignias} hint="Totales" accent="emerald" />
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-2">Progreso a siguiente nivel</p>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
                <div className="h-full w-[64%] bg-white/20" />
              </div>
              <p className="text-xs text-slate-400 mt-2">64% completado</p>
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-wider text-slate-300">Acciones rápidas</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5">
                + Actividad
              </button>
              <button className="px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5">
                Subir evidencia
              </button>
              <button className="px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5">
                Ver ranking
              </button>
              <button className="px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5">
                Reglas puntos
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              (Luego estas acciones se conectan a rutas reales y a gamificacionApi).
            </p>
          </GlassCard>
        </div>

        {/* Right: Tabs + content */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            {/* Tabs */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
                <TabBtn active={tab === "recompensas"} onClick={() => setTab("recompensas")}>
                  Recompensas
                </TabBtn>
                <TabBtn active={tab === "puntos"} onClick={() => setTab("puntos")}>
                  Puntos
                </TabBtn>
                <TabBtn active={tab === "ranking"} onClick={() => setTab("ranking")}>
                  Ranking
                </TabBtn>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-white/10"
                  placeholder="Buscar…"
                />
                <button className="px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5">
                  Filtros
                </button>
              </div>
            </div>

            <div className="mt-4">
              {tab === "recompensas" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rewardsMock.map((r) => (
                    <RewardCard key={r.id} reward={r} />
                  ))}
                </div>
              ) : null}

              {tab === "puntos" ? (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="grid grid-cols-12 px-4 py-3 bg-white/5 text-xs text-slate-300">
                    <div className="col-span-8">Regla</div>
                    <div className="col-span-4 text-right">Puntos</div>
                  </div>
                  <div className="divide-y divide-white/10">
                    {pointsMock.map((p) => (
                      <div key={p.id} className="grid grid-cols-12 px-4 py-3 text-sm text-slate-200">
                        <div className="col-span-8">
                          <p className="font-medium">{p.nombre}</p>
                          <p className="text-xs text-slate-400">Fuente: actividades / evidencias</p>
                        </div>
                        <div className="col-span-4 text-right font-semibold">{p.puntos}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {tab === "ranking" ? (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="grid grid-cols-12 px-4 py-3 bg-white/5 text-xs text-slate-300">
                    <div className="col-span-2">#</div>
                    <div className="col-span-7">Usuario</div>
                    <div className="col-span-3 text-right">Puntos</div>
                  </div>
                  <div className="divide-y divide-white/10">
                    {rankingMock.map((u, idx) => (
                      <div
                        key={u.id}
                        className={[
                          "grid grid-cols-12 px-4 py-3 text-sm",
                          u.nombre === "Tú" ? "bg-white/5" : "",
                        ].join(" ")}
                      >
                        <div className="col-span-2 text-slate-300">{idx + 1}</div>
                        <div className="col-span-7">
                          <p className="font-medium text-slate-100">{u.nombre}</p>
                          <p className="text-xs text-slate-400">{u.badge}</p>
                        </div>
                        <div className="col-span-3 text-right font-semibold text-slate-100">
                          {u.puntos}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-wider text-slate-300">Integración backend</p>
            <div className="mt-3 text-sm text-slate-200 space-y-2">
              <p>
                Este boceto está listo para conectar:
              </p>
              <ul className="list-disc pl-5 text-slate-300">
                <li>
                  <span className="text-slate-200 font-medium">Recompensas</span> ←
                  <code className="ml-2 text-xs bg-white/5 border border-white/10 px-2 py-1 rounded">
                    gamificacionApi.getRewards()
                  </code>
                </li>
                <li>
                  <span className="text-slate-200 font-medium">Puntos</span> ←
                  <code className="ml-2 text-xs bg-white/5 border border-white/10 px-2 py-1 rounded">
                    gamificacionApi.getPoints()
                  </code>
                </li>
                <li>
                  <span className="text-slate-200 font-medium">Ranking</span> ←
                  <code className="ml-2 text-xs bg-white/5 border border-white/10 px-2 py-1 rounded">
                    gamificacionApi.getRanking()
                  </code>
                </li>
              </ul>
              <p className="text-xs text-slate-400">
                Por ahora está en mock para que se vea tecnológico y consistente con el dashboard.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Background (simple tech look) */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.20),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,.18),transparent_40%),radial-gradient(circle_at_60%_90%,rgba(16,185,129,.14),transparent_45%)]" />
    </div>
  );
}

function GlassCard({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,.35)] backdrop-blur-md p-4">
      {children}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-lg text-sm transition",
        active ? "bg-white/10 text-slate-100" : "text-slate-300 hover:bg-white/5",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Kpi({ title, value, hint, accent = "cyan" }) {
  const accentClass =
    accent === "cyan"
      ? "border-cyan-400/30"
      : accent === "violet"
        ? "border-violet-400/30"
        : accent === "amber"
          ? "border-amber-400/30"
          : "border-emerald-400/30";

  return (
    <div className={["rounded-xl border bg-white/5 p-3", accentClass].join(" ")}>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-lg font-semibold text-slate-100 mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{hint}</p>
    </div>
  );
}

function RewardCard({ reward }) {
  const stateStyle =
    reward.estado === "Desbloqueada"
      ? "border-emerald-400/25"
      : reward.estado === "En progreso"
        ? "border-amber-400/25"
        : "border-white/10";

  return (
    <div className={["rounded-2xl border bg-white/5 p-4", stateStyle].join(" ")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{reward.nombre}</p>
          <p className="text-xs text-slate-400 mt-1">{reward.descripcion}</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 whitespace-nowrap">
          {reward.estado}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="text-xs px-3 py-2 rounded-lg border border-white/10 text-slate-200 hover:bg-white/5">
          Ver detalle
        </button>
        <div className="h-2 w-24 rounded-full bg-white/5 border border-white/10 overflow-hidden">
          <div className="h-full w-[42%] bg-white/20" />
        </div>
      </div>
    </div>
  );
}
