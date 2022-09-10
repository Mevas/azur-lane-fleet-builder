import { LoadoutId } from "../types/loadout";
import { useRecoilState } from "recoil";
import { loadoutSelector } from "../atoms/loadouts";

export const useLoadout = (id: LoadoutId) => {
  return useRecoilState(loadoutSelector(id));
};
