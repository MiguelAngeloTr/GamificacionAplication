import UpcomingItem from "./UpcomingItem"; // <-- fuerza el archivo correcto
import { styles } from "./dashboard.styles";

export default function UpcomingList({ items = [] }) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <h3 style={styles.panelTitle}>Próximas actividades</h3>
        <span style={styles.muted}>Top {items.length}</span>
      </div>

      <div style={styles.list}>
        {items.map((item) => (
          <UpcomingItem key={item.id} item={item} />
        ))}
      </div>

      <button style={styles.secondaryBtn}>Ir al tablero</button>
    </div>
  );
}
