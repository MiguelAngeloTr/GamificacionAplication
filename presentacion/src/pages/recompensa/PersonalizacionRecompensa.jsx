// src/pages/recompensa/PersonalizacionRecompensa.jsx
import { useMemo, useState } from "react";

export default function PersonalizacionRecompensa() {
  // Estado local (por ahora). Luego lo conectas al backend.
  const [pointsEnabled, setPointsEnabled] = useState(true);
  const [badgesEnabled, setBadgesEnabled] = useState(true);
  const [streaksEnabled, setStreaksEnabled] = useState(true);

  const [frequency, setFrequency] = useState("semanal"); // diario | semanal | mensual
  const [difficulty, setDifficulty] = useState("balanceado"); // facil | balanceado | exigente

  const [focus, setFocus] = useState({
    cursos: true,
    tareas: true,
    seguimiento: true,
  });

  const [notifications, setNotifications] = useState({
    email: false,
    app: true,
  });

  const summary = useMemo(() => {
    const focos = Object.entries(focus)
      .filter(([, v]) => v)
      .map(([k]) => k);

    return {
      mechanics: [
        pointsEnabled ? "Puntos" : null,
        badgesEnabled ? "Insignias" : null,
        streaksEnabled ? "Rachas" : null,
      ].filter(Boolean),
      focus: focos.length ? focos : ["(sin selección)"],
      frequency,
      difficulty,
      notifications,
    };
  }, [pointsEnabled, badgesEnabled, streaksEnabled, frequency, difficulty, focus, notifications]);

  const handleSave = () => {
    // Luego: POST/PUT a tu API (gamificación/recompensas)
    console.log("Preferencias guardadas:", summary);
    alert("Preferencias guardadas (simulado).");
  };

  const handleReset = () => {
    setPointsEnabled(true);
    setBadgesEnabled(true);
    setStreaksEnabled(true);
    setFrequency("semanal");
    setDifficulty("balanceado");
    setFocus({ cursos: true, tareas: true, seguimiento: true });
    setNotifications({ email: false, app: true });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Personalización de recompensas</h1>
          <p className="text-sm text-gray-500">
            Configura cómo quieres recibir progreso, logros y recordatorios.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="border rounded px-3 py-2 text-sm hover:bg-slate-50"
          >
            Restablecer
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white rounded px-3 py-2 text-sm hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel principal */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Mecánicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <ToggleCard
              title="Puntos"
              description="Acumula puntos por completar actividades."
              checked={pointsEnabled}
              onChange={setPointsEnabled}
            />
            <ToggleCard
              title="Insignias"
              description="Desbloquea insignias por hitos y constancia."
              checked={badgesEnabled}
              onChange={setBadgesEnabled}
            />
            <ToggleCard
              title="Rachas"
              description="Mantén una racha de progreso semanal."
              checked={streaksEnabled}
              onChange={setStreaksEnabled}
            />
          </div>

          <h2 className="text-sm font-semibold text-gray-900 mb-3">Enfoque de recompensas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <CheckRow
              label="Cursos"
              value={focus.cursos}
              onChange={(v) => setFocus((s) => ({ ...s, cursos: v }))}
            />
            <CheckRow
              label="Tareas"
              value={focus.tareas}
              onChange={(v) => setFocus((s) => ({ ...s, tareas: v }))}
            />
            <CheckRow
              label="Seguimiento"
              value={focus.seguimiento}
              onChange={(v) => setFocus((s) => ({ ...s, seguimiento: v }))}
            />
          </div>

          <h2 className="text-sm font-semibold text-gray-900 mb-3">Frecuencia y dificultad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Frecuencia de retos"
              value={frequency}
              onChange={setFrequency}
              options={[
                { value: "diario", label: "Diario" },
                { value: "semanal", label: "Semanal" },
                { value: "mensual", label: "Mensual" },
              ]}
            />
            <SelectField
              label="Nivel de exigencia"
              value={difficulty}
              onChange={setDifficulty}
              options={[
                { value: "facil", label: "Fácil" },
                { value: "balanceado", label: "Balanceado" },
                { value: "exigente", label: "Exigente" },
              ]}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Notificaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CheckRow
                label="Notificar en la app"
                value={notifications.app}
                onChange={(v) => setNotifications((s) => ({ ...s, app: v }))}
              />
              <CheckRow
                label="Notificar por correo"
                value={notifications.email}
                onChange={(v) => setNotifications((s) => ({ ...s, email: v }))}
              />
            </div>

            <p className="text-xs text-gray-500 mt-3">
              (Luego conectamos con el módulo de gamificación/recompensas y lo guardamos en BD).
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white border rounded-xl p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Resumen</h2>

          <div className="space-y-3">
            <SummaryItem
              label="Mecánicas activas"
              value={summary.mechanics.length ? summary.mechanics.join(", ") : "Ninguna"}
            />
            <SummaryItem label="Enfoque" value={summary.focus.join(", ")} />
            <SummaryItem label="Frecuencia" value={summary.frequency} />
            <SummaryItem label="Exigencia" value={summary.difficulty} />
            <SummaryItem
              label="Notificaciones"
              value={[
                summary.notifications.app ? "App" : null,
                summary.notifications.email ? "Correo" : null,
              ]
                .filter(Boolean)
                .join(", ") || "Ninguna"}
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-gray-500">
              Consejo: si vas empezando, usa <span className="font-medium">Balanceado</span> y
              frecuencia <span className="font-medium">Semanal</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleCard({ title, description, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "text-left border rounded-xl p-4 transition",
        checked ? "border-black" : "border-gray-200",
        checked ? "bg-black/5" : "bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <span
          className={[
            "inline-flex items-center justify-center w-10 h-6 rounded-full",
            checked ? "bg-black" : "bg-gray-200",
          ].join(" ")}
        >
          <span
            className={[
              "w-4 h-4 rounded-full bg-white transition",
              checked ? "translate-x-2" : "-translate-x-2",
            ].join(" ")}
          />
        </span>
      </div>
    </button>
  );
}

function CheckRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 border rounded-xl px-4 py-3">
      <span className="text-sm text-gray-800">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-700">{label}</span>
      <select
        className="border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="border rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 mt-1">{value}</p>
    </div>
  );
}
