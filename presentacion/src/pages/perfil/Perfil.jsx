// src/pages/perfil/Perfil.jsx
import { useMemo } from "react";
import { useProfile } from "../../hooks/auth/useProfile";

const ui = {
  page: {
    padding: 18,
    maxWidth: 1050,
    margin: "0 auto",
    color: "rgba(255,255,255,.92)",
  },
  hero: {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,.10)",
    background:
      "radial-gradient(1000px 450px at 20% -10%, rgba(59,130,246,.18), transparent 55%), radial-gradient(700px 400px at 90% 10%, rgba(34,197,94,.10), transparent 60%), rgba(15, 23, 42, .72)",
    boxShadow: "0 22px 70px rgba(0,0,0,.45)",
    padding: 16,
    backdropFilter: "blur(10px)",
  },
  heroTop: {
    display: "flex",
    gap: 14,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  title: { margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: ".3px" },
  subtitle: { margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,.65)" },

  avatarRow: { display: "flex", gap: 12, alignItems: "center", minWidth: 260 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    background:
      "linear-gradient(135deg, rgba(59,130,246,.9), rgba(99,102,241,.8), rgba(34,197,94,.55))",
    boxShadow: "0 10px 30px rgba(59,130,246,.22)",
    border: "1px solid rgba(255,255,255,.14)",
    display: "grid",
    placeItems: "center",
    fontWeight: 950,
    letterSpacing: ".5px",
  },
  small: { fontSize: 12, color: "rgba(255,255,255,.62)" },
  name: { fontSize: 14, fontWeight: 900, lineHeight: 1.1 },
  email: { fontSize: 12, color: "rgba(255,255,255,.7)" },

  chips: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  chip: (tone = "info") => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.12)",
    background:
      tone === "danger"
        ? "rgba(239,68,68,.12)"
        : tone === "ok"
        ? "rgba(34,197,94,.12)"
        : tone === "warn"
        ? "rgba(245,158,11,.12)"
        : "rgba(59,130,246,.12)",
    color: "rgba(255,255,255,.92)",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  }),
  dot: (tone = "info") => ({
    width: 8,
    height: 8,
    borderRadius: 999,
    background:
      tone === "danger"
        ? "rgba(239,68,68,.95)"
        : tone === "ok"
        ? "rgba(34,197,94,.95)"
        : tone === "warn"
        ? "rgba(245,158,11,.95)"
        : "rgba(59,130,246,.95)",
    boxShadow: "0 0 0 4px rgba(255,255,255,.06)",
  }),

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(15, 23, 42, .72)",
    boxShadow: "0 18px 50px rgba(0,0,0,.35)",
    padding: 14,
    backdropFilter: "blur(8px)",
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    inset: -2,
    background:
      "radial-gradient(500px 220px at 15% 0%, rgba(59,130,246,.18), transparent 55%)",
    pointerEvents: "none",
    opacity: 0.9,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 8,
    position: "relative",
  },
  h2: { margin: 0, fontSize: 13, fontWeight: 950, letterSpacing: ".14em", textTransform: "uppercase" },
  meta: { fontSize: 12, color: "rgba(255,255,255,.55)" },

  fieldRow: {
    display: "grid",
    gridTemplateColumns: "150px 1fr",
    gap: 12,
    padding: "9px 0",
    borderTop: "1px dashed rgba(255,255,255,.10)",
    position: "relative",
  },
  fieldLabel: { color: "rgba(255,255,255,.62)", fontSize: 12, fontWeight: 850, letterSpacing: ".03em" },
  fieldValue: { color: "rgba(255,255,255,.92)", fontSize: 13, fontWeight: 650, wordBreak: "break-word" },

  btn: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.92)",
    fontWeight: 900,
    cursor: "pointer",
  },

  statusLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,.10)",
    color: "rgba(255,255,255,.65)",
    fontSize: 12,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 12,
  },
  kpi: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.06)",
    padding: 12,
  },
  kpiLabel: { fontSize: 11, color: "rgba(255,255,255,.60)", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" },
  kpiValue: { marginTop: 6, fontSize: 18, fontWeight: 950 },
};

function Chip({ tone = "info", children }) {
  return (
    <span style={ui.chip(tone)}>
      <span style={ui.dot(tone)} />
      {children}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div style={ui.fieldRow}>
      <div style={ui.fieldLabel}>{label}</div>
      <div style={ui.fieldValue}>{value ?? "—"}</div>
    </div>
  );
}

function initials(nombre, apellido, correo) {
  const a = (nombre ?? "").trim();
  const b = (apellido ?? "").trim();
  if (a || b) return `${a[0] ?? ""}${b[0] ?? ""}`.toUpperCase() || "U";
  const c = (correo ?? "").trim();
  return (c[0] ?? "U").toUpperCase();
}

export default function Perfil() {
  const { data, loading, error, refetch } = useProfile(true);

  const usuario = data?.usuario;
  const roles = data?.roles ?? [];
  const perfil = data?.perfil;
  const coachRef = data?.coachRef ?? null;

  const tipoLabel = useMemo(() => {
    const t = perfil?.tipo ?? "usuario";
    if (t === "directiva") return "Directiva";
    if (t === "coach") return "Coach";
    if (t === "colaborador") return "Colaborador";
    return "Usuario";
  }, [perfil?.tipo]);

  const toneByTipo = (tipo) => {
    if (tipo === "Directiva") return "info";
    if (tipo === "Coach") return "ok";
    if (tipo === "Colaborador") return "warn";
    return "info";
  };

  if (loading) {
    return <div style={{ padding: 16, color: "rgba(255,255,255,.75)" }}>Cargando perfil...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(239,68,68,.10)",
            padding: 14,
            color: "rgba(255,255,255,.92)",
            boxShadow: "0 18px 50px rgba(0,0,0,.35)",
          }}
        >
          <div style={{ fontWeight: 950, marginBottom: 6 }}>No se pudo cargar el perfil</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.80)" }}>{String(error)}</div>

          <button onClick={refetch} style={ui.btn} type="button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    (perfil?.nombre || perfil?.apellido)
      ? `${perfil?.nombre ?? ""} ${perfil?.apellido ?? ""}`.trim()
      : usuario?.nombre ?? "—";

  const init = initials(perfil?.nombre, perfil?.apellido, usuario?.correo);

  return (
    <div style={ui.page}>
      {/* HERO */}
      <div style={ui.hero}>
        <div style={ui.heroTop}>
          <div style={ui.avatarRow}>
            <div style={ui.avatar} title="Usuario">
              {init}
            </div>

            <div>
              <div style={ui.small}>Perfil de sesión</div>
              <div style={ui.name}>{fullName}</div>
              <div style={ui.email}>{usuario?.correo ?? "—"}</div>
            </div>
          </div>

          <div>
            <h1 style={ui.title}>Perfil</h1>
            <p style={ui.subtitle}>Información del usuario, roles y perfil activo según tu sesión.</p>

            <div style={ui.statusLine}>
              <span style={{ opacity: 0.9 }}>Estado:</span>
              <span style={{ fontWeight: 900, color: "rgba(255,255,255,.9)" }}>Autenticado</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>ID: {usuario?.id ?? "—"}</span>
            </div>

            <div style={ui.kpiGrid}>
              <div style={ui.kpi}>
                <div style={ui.kpiLabel}>Tipo</div>
                <div style={ui.kpiValue}>{tipoLabel}</div>
              </div>
              <div style={ui.kpi}>
                <div style={ui.kpiLabel}>Roles</div>
                <div style={ui.kpiValue}>{roles.length || 0}</div>
              </div>
              <div style={ui.kpi}>
                <div style={ui.kpiLabel}>Coach</div>
                <div style={ui.kpiValue}>{perfil?.tipo === "colaborador" ? "Asignado" : "—"}</div>
              </div>
            </div>
          </div>

          <div style={ui.chips}>
            <Chip tone={toneByTipo(tipoLabel)}>{tipoLabel}</Chip>
            {roles.map((r) => (
              <Chip key={r} tone="info">
                {r}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div style={ui.grid}>
        {/* Usuario */}
        <div style={ui.card}>
          <div style={ui.cardGlow} />
          <div style={ui.cardHeader}>
            <h2 style={ui.h2}>Usuario</h2>
            <span style={ui.meta}>/auth/me</span>
          </div>

          <Field label="Nombre" value={usuario?.nombre} />
          <Field label="Correo" value={usuario?.correo} />
          <Field label="Roles" value={roles.length ? roles.join(", ") : "—"} />
        </div>

        {/* Perfil activo */}
        <div style={ui.card}>
          <div style={ui.cardGlow} />
          <div style={ui.cardHeader}>
            <h2 style={ui.h2}>Perfil activo</h2>
            <span style={ui.meta}>{tipoLabel}</span>
          </div>

          <Field label="Tipo" value={perfil?.tipo ?? "usuario"} />
          <Field label="Cédula" value={perfil?.cedula} />
          <Field label="Nombre" value={perfil?.nombre} />
          <Field label="Apellido" value={perfil?.apellido} />
          <Field label="Teléfono" value={perfil?.telefono} />
          <Field label="Dirección" value={perfil?.direccion} />
          <Field label="Nacionalidad" value={perfil?.nacionalidad} />

          {perfil?.tipo === "colaborador" && (
            <>
              <Field label="Coach asignado (cédula)" value={perfil?.fk_cedula_coachee ?? "—"} />
              <Field
                label="Coach asignado (nombre)"
                value={coachRef ? `${coachRef.nombre ?? ""} ${coachRef.apellido ?? ""}`.trim() || "—" : "—"}
              />
            </>
          )}

          {perfil?.observacion ? <Field label="Observación" value={perfil.observacion} /> : null}
        </div>
      </div>
    </div>
  );
}
