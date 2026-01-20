import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";

import { AuthProvider } from "./auth/Context";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import AppLayout from "./layouts/AppLayout";
import LoginPage from "./auth/LoginPage";

import Registro from "./pages/registro/Registro";
import Dashboard from "./pages/dashboard/Dashboard";
import Perfil from "./pages/perfil/Perfil";
import UnidadesRetorno from "./pages/unidadesRetorno/UnidadesRetorno";
import PersonalizacionRecompensa from "./pages/recompensa/PersonalizacionRecompensa";
import Logro from "./pages/logros/Logro";
import Files from "./pages/Files/Files";
import ConsultaActividad from "./pages/consultaActividad/ConsultaActividad";

import TaskForm from "./components/TasksForm/TaskForm";
import UnitsForm from "./components/UnitsForm/UnitsForm";
import Evidencia from "./components/Evidencias/Evidencia";
import NotFound from "./components/NotFound/NotFound";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/PerRecompensa") {
      toast.info("¡Aquí podrás personalizar tus recompensas!");
    }
  }, [location]);

  return (
    <PrimeReactProvider>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/registro" element={<Registro />} />

          {/* Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/edit/:id" element={<TaskForm />} />
              <Route path="/nueva" element={<TaskForm />} />
              <Route path="/edit/unit/:id" element={<UnitsForm />} />
              <Route path="/retorno" element={<UnidadesRetorno />} />
              <Route path="/PerRecompensa" element={<PersonalizacionRecompensa />} />
              <Route path="/logro" element={<Logro />} />
              <Route path="/consultaActividad" element={<ConsultaActividad />} />
              <Route path="/consultaActividad/:id" element={<ConsultaActividad />} />
              <Route path="/files" element={<Files />} />
            </Route>
          </Route>

          {/* Especial */}
          <Route path="/evidencia" element={<Evidencia />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </PrimeReactProvider>
  );
}
