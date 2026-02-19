import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";

import { AuthProvider } from "./auth/Context";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import AppLayout from "./layouts/AppLayout";
import LoginPage from "./auth/LoginPage";

import TaskForm from "./components/Collaborator/TasksForm/TaskForm";
import UnitsForm from "./components/Collaborator/UnitsForm/UnitsForm";
import NotFound from "./components/Shared/NotFound/NotFound";

// Lazy loading de páginas
const Registro = lazy(() => import("./pages/registro/Registro"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Perfil = lazy(() => import("./pages/perfil/Perfil"));
const UnidadesRetorno = lazy(() => import("./pages/unidadesRetorno/UnidadesRetorno"));
const PersonalizacionRecompensa = lazy(() => import("./pages/recompensa/PersonalizacionRecompensa"));
const Logro = lazy(() => import("./pages/logros/Logro"));
const ConsultaActividad = lazy(() => import("./pages/consultaActividad/ConsultaActividad"));

// Componente de carga simple
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/PerRecompensa") {
      toast.info("¡Aquí podrás personalizar tus recompensas!");
    }
  }, [location.pathname]);

  return (
    <PrimeReactProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/registro" element={<Registro />} />

            {/* Compartidas (coach / colaborador / directiva) */}
            <Route element={<ProtectedRoute allowedRoles={["coach", "colaborador", "directiva"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/perfil" element={<Perfil />} />
              </Route>
            </Route>

            {/* Solo colaborador */}
            <Route element={<ProtectedRoute allowedRoles={["colaborador"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/edit/:id" element={<TaskForm />} />
                <Route path="/nueva" element={<TaskForm />} />
                <Route path="/edit/unit/:id" element={<UnitsForm />} />

                <Route path="/retorno" element={<UnidadesRetorno />} />
                <Route path="/PerRecompensa" element={<PersonalizacionRecompensa />} />
                <Route path="/logro" element={<Logro />} />

              </Route>
            </Route>

            {/* Solo coach (cuando tengas rutas reales de coach) */}
            <Route element={<ProtectedRoute allowedRoles={["coach"]} />}>
              <Route element={<AppLayout />}>
                {/* Ejemplo:
                <Route path="/coach/revisiones" element={<Revisiones />} />
                */}
                <Route path="/consultaActividad" element={<ConsultaActividad />} />
                <Route path="/consultaActividad/:id" element={<ConsultaActividad />} />
              </Route>
            </Route>

            {/* Solo directiva (cuando tengas rutas reales de directiva) */}
            <Route element={<ProtectedRoute allowedRoles={["directiva"]} />}>
              <Route element={<AppLayout />}>
                {/* Ejemplo:
                <Route path="/directiva/reportes" element={<Reportes />} />
                */}
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </PrimeReactProvider>
  );
}
