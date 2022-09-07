import { useRecoilValue, useSetRecoilState } from "recoil";
import { fleetIds, fleetSelector } from "../atoms/fleets";
import { v4 as uuid } from "uuid";
import { useCallback, useMemo } from "react";

export const useFleets = () => {
  const ids = useRecoilValue(fleetIds);
  const setFleet = useSetRecoilState(fleetSelector(uuid()));

  const create = useCallback(() => {
    setFleet({
      name: "test",
      ships: {
        main: {
          left: undefined,
          center: undefined,
          right: undefined,
        },
        vanguard: {
          left: undefined,
          center: undefined,
          right: undefined,
        },
      },
    });
  }, [setFleet]);

  return useMemo(() => ({ ids, create }), [create, ids]);
};
