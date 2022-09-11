import { useContext, useMemo } from "react";
import { FleetContext } from "../providers/fleet-context";

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (context === undefined) {
    throw new Error("useFleet must be used within a FleetProvider");
  }

  return useMemo(
    () =>
      [
        context.fleet,
        { setFleet: context.setFleet, setShip: context.setShip },
      ] as const,
    [context.fleet, context.setFleet, context.setShip]
  );
};
