export default function Spinner({ fullScreen = false, label = "Cargando..." }) {
  const wrapper = fullScreen
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={wrapper}>
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
    </div>
  );
}
