import { useContext, useMemo } from "react";
import { LoadoutContext } from "../providers/loadout-context";
import _ from "lodash";

export const useLoadout = () => {
  const context = useContext(LoadoutContext);
  if (context === undefined) {
    throw new Error("useLoadout must be used within a LoadoutProvider");
  }

  return useMemo(
    () => [context.loadout, { ..._.omit(context, "loadout") }] as const,
    [context]
  );
};
