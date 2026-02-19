import { useEffect, useMemo, useState } from "react";
import StatCard from "./StatCard";
import ProgressPanel from "./ProgressPanel";
import UpcomingList from "./UpcomingList";
import { styles } from "./dashboard.styles";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";


export default function DashboardView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const { data } = await api.get("/actividades/all");
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setItems([]);
        console.error("Error loading actividades:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  console.log("Actividades cargadas:", items);
  // Helpers (AJUSTA si tu backend usa otro código de estados)
  const isDone = (a) => a?.estado === 0; // ejemplo: 0 = completada
  const isPending = (a) => a?.estado === 1; // ejemplo: 1 = pendiente / en curso

  const getStart = (a) => {
    const t = new Date(a?.fecha_inicio).getTime();
    return Number.isFinite(t) ? t : NaN;
  };

  const getEnd = (a) => {
    if (!a?.fecha_final) return NaN;
    const t = new Date(a.fecha_final).getTime();
    return Number.isFinite(t) ? t : NaN;
  };

  const stats = useMemo(() => {
    const now = Date.now();
    const in48h = now + 48 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;

    const pending = items.filter(isPending).length;

    // Vencen pronto: usa fecha_final si existe; si no, usa fecha_inicio como fallback
    const dueSoon = items.filter((a) => {
      if (!isPending(a)) return false;
      const due = Number.isFinite(getEnd(a)) ? getEnd(a) : getStart(a);
      return Number.isFinite(due) && due >= now && due <= in48h;
    }).length;

    const overdue = items.filter((a) => {
      if (!isPending(a)) return false;
      const due = Number.isFinite(getEnd(a)) ? getEnd(a) : getStart(a);
      return Number.isFinite(due) && due < now;
    }).length;

    // Si no tienes fecha_completado, usamos fecha_final y si no, fecha_inicio como aproximación
    const completedWeek = items.filter((a) => {
      if (!isDone(a)) return false;
      const doneAt = Number.isFinite(getEnd(a)) ? getEnd(a) : getStart(a);
      return Number.isFinite(doneAt) && doneAt >= last7d && doneAt <= now;
    }).length;

    const doneCount = items.filter(isDone).length;
    const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;

    return { pending, dueSoon, overdue, completedWeek, progress };
  }, [items]);

  const upcoming = useMemo(() => {
    const now = Date.now();

    return items
      .filter((a) => {
        if (!isPending(a)) return false;
        const due = Number.isFinite(getEnd(a)) ? getEnd(a) : getStart(a);
        return Number.isFinite(due) && due >= now;
      })
      .sort((a, b) => {
        const da = Number.isFinite(getEnd(a)) ? getEnd(a) : getStart(a);
        const db = Number.isFinite(getEnd(b)) ? getEnd(b) : getStart(b);
        return da - db;
      })
      .slice(0, 5);
  }, [items]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Cargando actividades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Resumen operativo, progreso y próximos pasos</p>
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => navigate("/nueva")}>+ Nueva actividad </button>
          <button style={styles.ghostBtn}>Ver actividades</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.grid4}>
        <StatCard title="Pendientes" value={stats.pending} hint="Asignadas a ti" />
        <StatCard title="Vencen pronto" value={stats.dueSoon} hint="En 48 horas" accent="warn" />
        <StatCard title="Vencidas" value={stats.overdue} hint="Requiere acción" accent="danger" />
        <StatCard title="Completadas" value={stats.completedWeek} hint="Últimos 7 días" accent="ok" />
      </div>

      {/* Panels */}
      <div style={styles.grid2}>
        <ProgressPanel progress={stats.progress} />
        <UpcomingList items={upcoming} />
      </div>
    </div>
  );
}
