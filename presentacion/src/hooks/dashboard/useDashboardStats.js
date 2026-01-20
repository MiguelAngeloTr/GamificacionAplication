import { useEffect, useState } from "react";

export  function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        pending: 8,
        dueSoon: 3,
        overdue: 1,
        completedWeek: 12,
        progress: 64,
      });
      setLoading(false);
    }, 300);
    setTimeout(() => {
      setStats({
        pending: 8,
        dueSoon: 3,
        overdue: 1,
        completedWeek: 12,
        progress: 64,
      });
      setLoading(false);
    }, 300);
  }, []);

  return { stats, loading };
}
