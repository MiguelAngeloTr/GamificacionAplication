export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600">{label}</label>
      )}
      <input
        {...props}
        className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-black/20"
      />
    </div>
  );
}
