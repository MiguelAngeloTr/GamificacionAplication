export const getApiErrorMessage = (err, fallback = "Ocurrió un error") => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};
