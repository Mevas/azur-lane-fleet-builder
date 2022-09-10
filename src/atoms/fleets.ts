import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Fleet, FleetShip, ShipId } from "../types/ship";
import { loadoutSelector } from "./loadouts";

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
      const fleet = get(fleetsStateFamily(fleetId));

      return {
        ...fleet,
        ships: Object.fromEntries(
          Object.entries(fleet.ships).map(([type, positioning]) => [
            type,
            Object.fromEntries(
              Object.entries(positioning).map(([position, ship]) => {
                if (!ship?.loadoutId) {
                  return [position, ship];
                }

                return [
                  position,
                  { ...ship, loadout: get(loadoutSelector(ship.loadoutId)) },
                ];
              })
            ),
          ])
        ),
      } as Fleet;
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
        set(fleetIds, (current) =>
          current.includes(fleetId) ? current : [...current, fleetId]
        );
      }
    },
});

export const fleetShipSelector = selectorFamily<
  FleetShip | undefined,
  { fleetId: FleetId; shipId: ShipId }
>({
  key: "fleetShipSelector",
  get:
    ({ fleetId, shipId }) =>
    ({ get }) => {
      const fleet = get(fleetSelector(fleetId));

      return Object.values(fleet.ships)
        .flatMap((value) => Object.values(value).flatMap((v) => v))
        .find((p) => p?.id === shipId);
    },
});
