import { APP_TZ } from "./constants";

// Convierte Date o string a "YYYY-MM-DD" (para inputs date)
export const toISODateInput = (value) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

// Formatea fecha en es-CO con timezone del proyecto
export const formatDateCO = (value, options = {}) => {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: APP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(d);
};

// Formatea fecha y hora
export const formatDateTimeCO = (value, options = {}) => {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: APP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(d);
};
