import { styles } from "./dashboard.styles";

export default function QuickAction({ title, desc, onClick }) {
  return (
    <button
      style={styles.quick}
      onClick={onClick}
      aria-label={`Acción rápida: ${title}`}
    >
      <div style={styles.quickTitle}>
        {title}
      </div>

      <div style={styles.quickDesc}>
        {desc}
      </div>
    </button>
  );
}
