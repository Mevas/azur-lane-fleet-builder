import { LoadoutId } from "../types/loadout";
import { useRecoilState } from "recoil";
import { loadoutSelector } from "../atoms/loadouts";
import { Equipment } from "../utils/data";

export const useLoadout = (id: LoadoutId) => {
  const [loadout, setLoadout] = useRecoilState(loadoutSelector(id));

  const setItem = (position: number, item: Equipment | null) => {
    setLoadout((currVal) => {
      return {
        ...currVal,
        items: currVal.items.map((_item, index) =>
          index === position ? item : _item
        ),
      };
    });
  };

  return [loadout, { setLoadout, setItem }] as const;
};

export type SetItem = ReturnType<typeof useLoadout>[1]["setItem"];
