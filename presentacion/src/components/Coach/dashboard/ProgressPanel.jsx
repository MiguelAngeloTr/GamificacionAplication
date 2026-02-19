import ProgressSteps from "./ProgressSteps.jsx";

import QuickAction from "./QuickAction.jsx";
import { styles } from "./dashboard.styles";

export default function ProgressPanel({ progress = 0 }) {
  console.log({
  ProgressSteps_type: typeof ProgressSteps,
  QuickAction_type: typeof QuickAction,
  ProgressSteps_value: ProgressSteps,
  QuickAction_value: QuickAction,
});

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <h3 style={styles.panelTitle}>Progreso del Plan</h3>
        <span style={styles.badge}>Activo</span>
      </div>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <ProgressSteps />

      <div style={styles.quickGrid}>
        <QuickAction title="Insignias y logros" desc="Ver desempeño y métricas" />
        <QuickAction title="Reportes" desc="Exportar resultados" />
        <QuickAction title="Alertas" desc="Riesgos y vencimientos" />
        <QuickAction title="Usuarios/Roles" desc="Gestión de acceso" />
      </div>
    </div>
  );
}
