export const ROLE = Object.freeze({
  COACH: "coach",
  COLABORADOR: "colaborador",
  DIRECTIVA: "directiva",
});

// Normaliza roles que pueden venir como:
// - array: ["coach","colaborador"]
// - string: "coach,colaborador"
export const normalizeRoles = (r) => {
  if (!r) return [];
  if (Array.isArray(r)) return r.map((x) => String(x).trim()).filter(Boolean);
  if (typeof r === "string") {
    return r
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
};

export const hasRole = (roles = [], roleName) => roles.includes(roleName);

export const hasAnyRole = (roles = [], allowed = []) => {
  if (!allowed || allowed.length === 0) return true;
  return allowed.some((r) => roles.includes(r));
};
