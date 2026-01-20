import { useEffect, useState } from "react";

export function useUpcomingActivities() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUpcoming([
        {
          id: 1,
          title: "Revisar insignias coach - Sprint 2",
          date: "Hoy 4:00 PM",
          priority: "Alta",
          status: "En curso",
        },
        {
          id: 2,
          title: "Validar evidencias Plan Carrera",
          date: "Mañana 9:00 AM",
          priority: "Media",
          status: "Pendiente",
        },
      ]);
      setLoading(false);
    }, 300);
  }, []);

  return { upcoming, loading };
}
