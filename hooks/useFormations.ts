import { useRecoilValue, useSetRecoilState } from "recoil";
import { formationIds, formationSelector } from "../atoms/formations";
import { v4 as uuid } from "uuid";
import { useCallback, useMemo } from "react";

export const useFormations = () => {
  const ids = useRecoilValue(formationIds);
  const setFormation = useSetRecoilState(formationSelector(uuid()));

  const create = useCallback(() => {
    setFormation({
      name: "test",
      fleets: {
        surface: [],
        sub: null,
      },
    });
  }, [setFormation]);

  return useMemo(() => ({ ids, create }), [create, ids]);
};
