import { useMemo } from "react";

export function useRecoveryProgress(clients: any[]) {
  return useMemo(() => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul",
      "Aug","Sep","Oct","Nov","Dec"
    ];

    const data = months.map((m) => ({
      month: m,
      newClients: 0,
      ongoing: 0,
      recovered: 0,
    }));

    clients.forEach((client) => {
      const date = new Date(client.joinDate);
      const monthIndex = date.getMonth();

      if (client.status === "New") data[monthIndex].newClients++;
      else if (client.status === "Under Recovery") data[monthIndex].ongoing++;
      else if (client.status === "Recovered") data[monthIndex].recovered++;
    });

    return data;
  }, [clients]);
}
