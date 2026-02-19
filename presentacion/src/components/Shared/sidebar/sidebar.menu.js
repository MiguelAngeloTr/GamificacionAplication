import {
  faAward,
  faUser,
  faTrophy,
  faTachometerAlt,
  faSearch,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

export const MENU = {
  common: [
    { to: "/dashboard", label: "Dashboard", icon: faTachometerAlt },
    { to: "/perfil", label: "Perfil", icon: faUser },
  ],

  // Rutas reales de colaborador (App.jsx)
  colaborador: [
    { to: "/retorno", label: "Unidades Retorno", icon: faRotateLeft },
    { to: "/PerRecompensa", label: "Recompensas", icon: faAward },
    { to: "/logro", label: "Logros obtenidos", icon: faTrophy },
   
  ],

  // Por ahora NO tienes rutas 
  //  coach adicionales en App.jsx (solo dashboard/perfil ya están en common)
  coach: [
     { to: "/consultaActividad", label: "Consultar", icon: faSearch }
  ],

  // Aún no tienes rutas directiva definidas en App.jsx
  directiva: [],
};
