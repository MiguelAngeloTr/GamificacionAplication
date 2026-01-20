import { useAuth } from "../../auth/Context";

export default function Dashboard() {
  const { user, roles } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">Dashboard</h1>

      <div className="bg-white border rounded-xl p-4">
        <p className="text-sm text-gray-700">
          Bienvenido, <b>{user?.nombre ?? "Usuario"}</b>
        </p>
        <p className="text-sm text-gray-500">
          Correo: {user?.correo ?? "—"}
        </p>
        <p className="text-sm text-gray-500">
          Roles: {roles?.length ? roles.join(", ") : "—"}
        </p>

        <div className="mt-4 text-sm text-gray-600">
          Desde aquí puedes navegar usando el sidebar.
        </div>
      </div>
    </div>
  );
}
