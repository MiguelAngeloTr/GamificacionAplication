export const styles = {
  page: {
    padding: 18,
    color: "rgba(255,255,255,.92)",
    background:
      "radial-gradient(1200px 600px at 10% 0%, rgba(59,130,246,.10), transparent 60%), #0b1220",
    minHeight: "30%",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 16,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 750, letterSpacing: ".2px" },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "rgba(255,255,255,.65)",
  },

  actions: { display: "flex", gap: 10 },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(59,130,246,.85)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.9)",
    fontWeight: 650,
    cursor: "pointer",
  },
  secondaryBtn: {
    marginTop: 12,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.9)",
    fontWeight: 650,
    cursor: "pointer",
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginBottom: 12,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 12,
  },

  panel: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(15, 23, 42, .72)",
    boxShadow: "0 18px 50px rgba(0,0,0,.35)",
    padding: 14,
    backdropFilter: "blur(8px)",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  panelTitle: { margin: 0, fontSize: 14, fontWeight: 750 },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
  },
///KPI 


  card: (accent) => ({
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(15, 23, 42, .72)",
    boxShadow: "0 18px 50px rgba(0,0,0,.35)",
    padding: 14,
    backdropFilter: "blur(8px)",
  }),
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 12,
    color: "rgba(255,255,255,.65)",
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
  },
  cardChip: (accent) => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    background:
      accent === "danger"
        ? "rgba(239,68,68,.9)"
        : accent === "warn"
        ? "rgba(245,158,11,.9)"
        : accent === "ok"
        ? "rgba(34,197,94,.9)"
        : "rgba(59,130,246,.9)",
    boxShadow: "0 0 0 4px rgba(255,255,255,.06)",
  }),
  cardValue: { marginTop: 10, fontSize: 26, fontWeight: 820 },
  cardHint: { marginTop: 6, fontSize: 12, color: "rgba(255,255,255,.6)" },

  /* ===== PROGRESO ===== */
  progressWrap: { paddingTop: 6 },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressValue: {
    fontWeight: 800,
    fontSize: 13,
    color: "rgba(255,255,255,.9)",
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,.08)",
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "rgba(59,130,246,.9)",
  },

  /* ===== STEPS ===== */
  steps: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  step: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: (active) => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    background: active
      ? "rgba(59,130,246,.95)"
      : "rgba(255,255,255,.18)",
  }),
  stepLabel: (active) => ({
    fontSize: 12,
    color: active
      ? "rgba(255,255,255,.9)"
      : "rgba(255,255,255,.55)",
    fontWeight: 650,
  }),

  /* ===== QUICK ACTIONS ===== */
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginTop: 10,
  },
  quick: {
    textAlign: "left",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.06)",
    padding: 12,
    cursor: "pointer",
  },
  quickTitle: { fontWeight: 750, fontSize: 13 },
  quickDesc: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,.65)",
  },

  /* ===== UPCOMING LIST ===== */
  list: { display: "flex", flexDirection: "column", gap: 10 },
  listItem: {
    display: "flex",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.06)",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "rgba(59,130,246,.9)",
    marginTop: 6,
  },
  listBody: { flex: 1, minWidth: 0 },
  listTop: {
    display: "flex",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontWeight: 720,
    fontSize: 13,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  listMeta: {
    display: "flex",
    gap: 8,
    marginTop: 6,
    fontSize: 12,
  },
  muted: { color: "rgba(255,255,255,.62)" },

  pill: (priority) => ({
    fontSize: 11,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.12)",
    background:
      priority === "Alta"
        ? "rgba(239,68,68,.14)"
        : priority === "Media"
        ? "rgba(245,158,11,.14)"
        : "rgba(34,197,94,.14)",
    color: "rgba(255,255,255,.9)",
    fontWeight: 750,
    whiteSpace: "nowrap",
  }),
};
