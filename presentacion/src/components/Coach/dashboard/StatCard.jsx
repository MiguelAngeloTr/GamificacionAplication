import { styles } from "./dashboard.styles";

export default function StatCard({ title, value, hint, accent }) {
  return (
    <div style={styles.card(accent)}>
      <div style={styles.cardTop}>
        <span style={styles.cardTitle}>{title}</span>
        <span style={styles.cardChip(accent)} />
      </div>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardHint}>{hint}</div>
    </div>
  );
}
