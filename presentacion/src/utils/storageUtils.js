export const safeGet = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
};

export const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};
