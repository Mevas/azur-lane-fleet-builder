import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Loadout } from "../types/loadout";

export type LoadoutId = string;

const loadoutsStateFamily = atomFamily<Loadout, LoadoutId>({
  key: "loadouts",
  default: undefined,
});

export const loadoutIds = atom<LoadoutId[]>({
  key: "loadoutIds",
  default: [],
});

export const loadoutSelector = selectorFamily<Loadout, LoadoutId>({
  key: "loadoutSelector",
  get:
    (loadoutId) =>
    ({ get }) => {
      return get(loadoutsStateFamily(loadoutId));
    },
  set:
    (loadoutId) =>
    ({ set, reset }, newLoadout) => {
      // if 'newLoadout' is an instance of Default value,
      // the 'set' method will delete the atom from the atomFamily.
      if (newLoadout instanceof DefaultValue) {
        // reset method deletes the atom from atomFamily. Then update ids list.
        reset(loadoutsStateFamily(loadoutId));
        set(loadoutIds, (prevValue) =>
          prevValue.filter((id) => id !== loadoutId)
        );
      } else {
        // creates the atom and update the ids list
        set(loadoutsStateFamily(loadoutId), newLoadout);
        set(loadoutIds, (current) =>
          current.includes(loadoutId) ? current : [...current, loadoutId]
        );
      }
    },
});
