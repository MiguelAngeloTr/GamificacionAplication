import { Navigate } from "react-router-dom";
import { useAuth } from "./Context";
import LoginForm from "./LoginForm";
import Spinner from "../components/ui/Spinner";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner fullScreen label="Cargando..." />;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
