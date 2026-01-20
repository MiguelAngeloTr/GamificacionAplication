export default function Button({ children, loading, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`bg-black text-white py-2 rounded hover:opacity-90 disabled:opacity-60 ${className}`}
    >
      {loading ? "Cargando..." : children}
    </button>
  );
}
