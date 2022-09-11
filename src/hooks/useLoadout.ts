import { useContext, useMemo } from "react";
import { LoadoutContext } from "../providers/loadout-context";

export const useLoadout = () => {
  const context = useContext(LoadoutContext);
  if (context === undefined) {
    throw new Error("useLoadout must be used within a LoadoutProvider");
  }

  return useMemo(
    () =>
      [
        context.loadout,
        { setLoadout: context.setLoadout, setItem: context.setItem },
      ] as const,
    [context.loadout, context.setItem, context.setLoadout]
  );
};
