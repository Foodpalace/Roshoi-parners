import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClientState } from "@/lib/client-state";
import { getBootstrap } from "@/lib/server/api-bootstrap";

export function useVendor() {
  const restaurantId = useClientState((s) => s.restaurantId);
  const setRestaurantId = useClientState((s) => s.setRestaurantId);
  const q = useQuery({
    queryKey: ["bootstrap"],
    queryFn: () => getBootstrap(),
    staleTime: 15_000,
  });
  const memberships = q.data?.memberships ?? [];
  const selected =
    memberships.find((m) => m.restaurantId === restaurantId) ?? memberships[0] ?? null;

  useEffect(() => {
    if (selected && selected.restaurantId !== restaurantId) {
      setRestaurantId(selected.restaurantId);
    }
  }, [selected, restaurantId, setRestaurantId]);

  return {
    ...q,
    memberships,
    selected,
    restaurantId: selected?.restaurantId,
    dataLabel: selected?.dataLabel,
    role: selected?.role,
    adapters: q.data?.adapters,
    featureFlags: q.data?.featureFlags,
  };
}
