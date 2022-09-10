import { useRecoilValue, useSetRecoilState } from "recoil";
import { fleetIds, fleetSelector } from "../atoms/fleets";
import { v4 as uuid } from "uuid";
import { useCallback, useMemo, useRef } from "react";
import { FormationId } from "../atoms/formations";

export const useFleets = () => {
  const ids = useRecoilValue(fleetIds);
  const newId = useRef(uuid());
  const setFleet = useSetRecoilState(fleetSelector(newId.current));

  const create = useCallback(
    (formationId: FormationId) => {
      setFleet({
        id: newId.current,
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

      newId.current = uuid();
    },
    [setFleet]
  );

  return useMemo(() => ({ ids, create }), [create, ids]);
};
