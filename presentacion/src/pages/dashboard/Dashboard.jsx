import { useMemo } from "react";
import { useAuth } from "../../auth/Context";

import CoachDashboardView from "../../components/Coach/dashboard/DashboardView";
import ColaboradorDashboardView from "../../components/Collaborator/dashboard/DashboardViewCollaborator";
import DirectivaDashboardView from "../../components/Executive/dashboard/DashboardView";

import { useDashboardStats } from "../../hooks/dashboard/useDashboardStats";
import { useUpcomingActivities } from "../../hooks/dashboard/useUpcomingActivities";

function getPrimaryRole(roles = []) {
  if (roles.includes("directiva")) return "directiva";
  if (roles.includes("coach")) return "coach";
  if (roles.includes("colaborador")) return "colaborador";
  return "colaborador";
}

export default function Dashboard() {
  const { roles = [] } = useAuth();
  const primaryRole = useMemo(() => getPrimaryRole(roles), [roles]);

  // Hooks de data: puedes reusarlos o separarlos por rol después
  const { stats, loading: statsLoading } = useDashboardStats(primaryRole);
  const { upcoming, loading: upcomingLoading } = useUpcomingActivities(primaryRole);

  const loading = statsLoading || upcomingLoading;
  if (loading) return <div>Cargando dashboard...</div>;

  const View =
    primaryRole === "directiva"
      ? DirectivaDashboardView
      : primaryRole === "coach"
      ? CoachDashboardView
      : ColaboradorDashboardView;

  return <View stats={stats} upcoming={upcoming} />;
}
