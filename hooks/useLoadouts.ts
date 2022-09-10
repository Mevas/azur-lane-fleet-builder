import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useMemo } from "react";
import { loadoutIds, loadoutSelector } from "../atoms/loadouts";
import { ShipId } from "../types/ship";
import { useUuid } from "./useUuid";

export const useLoadouts = () => {
  const ids = useRecoilValue(loadoutIds);
  const [newId, regenId] = useUuid();
  const setLoadout = useSetRecoilState(loadoutSelector(newId.current));

  const create = useCallback(
    (shipId: ShipId) => {
      const loadoutId = newId.current;
      setLoadout({
        id: loadoutId,
        shipId,
        items: [null, null, null, null, null],
      });

      regenId();

      return loadoutId;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setLoadout]
  );

  return useMemo(() => ({ ids, create }), [create, ids]);
};
