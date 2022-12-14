import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Formation } from "../types/ship";
import { fleetIds, fleetSelector } from "./fleets";

export type FormationId = string;

const formationsStateFamily = atomFamily<Formation, FormationId>({
  key: "formations",
  default: undefined,
});

export const formationIds = atom<FormationId[]>({
  key: "formationsIds",
  default: [],
});

export const formationSelector = selectorFamily<Formation, FormationId>({
  key: "formationsSelector",
  get:
    (formationsId) =>
    ({ get }) => {
      const formation = get(formationsStateFamily(formationsId));
      return {
        ...formation,
        fleets: {
          ...formation.fleets,
          surface: get(fleetIds)
            .map((fleetId) => get(fleetSelector(fleetId)))
            .filter((fleet) => fleet.formationId === formationsId),
        },
      };
    },
  set:
    (formationsId) =>
    ({ set, reset }, newFormation) => {
      // if 'newFormation' is an instance of Default value,
      // the 'set' method will delete the atom from the atomFamily.
      if (newFormation instanceof DefaultValue) {
        // reset method deletes the atom from atomFamily. Then update ids list.
        reset(formationsStateFamily(formationsId));
        set(formationIds, (prevValue) =>
          prevValue.filter((id) => id !== formationsId)
        );
      } else {
        // creates the atom and update the ids list
        set(formationsStateFamily(formationsId), newFormation);
        set(formationIds, (current) =>
          current.includes(formationsId) ? current : [...current, formationsId]
        );
      }
    },
});
