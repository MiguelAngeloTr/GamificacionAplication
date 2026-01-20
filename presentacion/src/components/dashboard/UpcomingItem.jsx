import { styles } from "./dashboard.styles";

export default function UpcomingItem({ item }) {
  return (
    <div style={styles.listItem}>
      <div style={styles.dot} />

      <div style={styles.listBody}>
        <div style={styles.listTop}>
          <span style={styles.listTitle} title={item.title}>
            {item.title}
          </span>

          <span style={styles.pill(item.priority)}>
            {item.priority}
          </span>
        </div>

        <div style={styles.listMeta}>
          <span style={styles.muted}>{item.date}</span>
          <span style={styles.muted}>•</span>
          <span style={styles.muted}>{item.status}</span>
        </div>
      </div>
    </div>
  );
}
