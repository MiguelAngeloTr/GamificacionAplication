import DashboardView from "../../components/dashboard/DashboardView";
import { useDashboardStats } from "../../hooks/dashboard/useDashboardStats";
import { useUpcomingActivities } from "../../hooks/dashboard/useUpcomingActivities";

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { upcoming, loading: upcomingLoading } = useUpcomingActivities();

  const loading = statsLoading || upcomingLoading;

  if (loading) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <DashboardView
      stats={stats}
      upcoming={upcoming}
    />
  );
}
