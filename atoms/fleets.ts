import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Fleet } from "../types/ship";

export type FleetId = string;

const fleetsStateFamily = atomFamily<Fleet, FleetId>({
  key: "fleets",
  default: undefined,
});

export const fleetIds = atom<FleetId[]>({
  key: "fleetIds",
  default: [],
});

export const fleetSelector = selectorFamily<Fleet, FleetId>({
  key: "fleetSelector",
  get:
    (fleetId) =>
    ({ get }) => {
      return get(fleetsStateFamily(fleetId));
    },
  set:
    (fleetId) =>
    ({ set, reset }, newFleet) => {
      // if 'newFleet' is an instance of Default value,
      // the 'set' method will delete the atom from the atomFamily.
      if (newFleet instanceof DefaultValue) {
        // reset method deletes the atom from atomFamily. Then update ids list.
        reset(fleetsStateFamily(fleetId));
        set(fleetIds, (prevValue) => prevValue.filter((id) => id !== fleetId));
      } else {
        // creates the atom and update the ids list
        set(fleetsStateFamily(fleetId), newFleet);
        set(fleetIds, (prev) => [...prev, fleetId]);
      }
    },
});
