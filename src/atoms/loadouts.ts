import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Loadout, LoadoutId } from "../types/loadout";
import { Attrs, StatName } from "../types/ship";
import { attributes, emptyAttributes } from "../utils/constants";

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
      const loadout = get(loadoutsStateFamily(loadoutId));

      const bonusAttributes: Attrs = [...emptyAttributes];
      loadout.items.forEach((item) => {
        if (!item) {
          return;
        }

        [1, 2, 3].forEach((index) => {
          const attributeName = (item.stats as any)[`attribute_${index}`] as
            | StatName
            | undefined;

          if (!attributeName) {
            return;
          }

          bonusAttributes[attributes[attributeName][1]] +=
            +(item.stats as any)[`value_${index}`] ?? 0;
        });
      });

      return { ...loadout, bonusAttributes };
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
