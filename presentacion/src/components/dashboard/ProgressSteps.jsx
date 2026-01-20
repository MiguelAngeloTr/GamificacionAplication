import { styles } from "./dashboard.styles";

export default function ProgressSteps() {
  return (
    <div style={styles.steps}>
      <Step label="Planeación" active />
      <Step label="En curso" active />
      <Step label="Revisión" />
      <Step label="Cierre" />
    </div>
  );
}

export function Step({ label, active }) {
  return (
    <div style={styles.step}>
      <span style={styles.stepDot(active)} />
      <span style={styles.stepLabel(active)}>
        {label}
      </span>
    </div>
  );
}
