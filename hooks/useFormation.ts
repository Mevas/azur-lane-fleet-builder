import { useRecoilValue } from "recoil";
import { FormationId, formationSelector } from "../atoms/formations";

export const useFormation = (id: FormationId) => {
  return useRecoilValue(formationSelector(id));
};
