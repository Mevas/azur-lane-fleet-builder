import { useRecoilValue, useSetRecoilState } from "recoil";
import { fleetIds, fleetSelector } from "../atoms/fleets";
import { useCallback, useMemo } from "react";
import { FormationId } from "../atoms/formations";
import { useUuid } from "./useUuid";

export const useFleets = () => {
  const ids = useRecoilValue(fleetIds);
  const [newIdRef, regenId] = useUuid();
  const setFleet = useSetRecoilState(fleetSelector(newIdRef.current));

  const create = useCallback(
    (formationId: FormationId) => {
      setFleet({
        id: newIdRef.current,
        name: "test",
        formationId,
        ships: {
          main: {
            left: null,
            center: null,
            right: null,
          },
          vanguard: {
            left: null,
            center: null,
            right: null,
          },
        },
      });

      regenId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regenId, setFleet]
  );

  return useMemo(() => ({ ids, create }), [create, ids]);
};
