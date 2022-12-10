import { atomFamily, selectorFamily } from "recoil";
import { FleetShip, OwnedShip, ShipId } from "../types/ship";
import { ships } from "../utils/data";
import { FleetId, fleetSelector } from "./fleets";

const defaultState = {
  level: 100,
  lb: 3,
  intimacy: "love",
  enhanced: true,
} as const;

const defaultShips = Object.fromEntries(
  Object.entries(ships).map(([key]) => [
    key,
    {
      ...defaultState,
      id: +key,
    },
  ])
);

export const shipsStateFamily = atomFamily<OwnedShip, number>({
  key: "ships",
  default: (id) => defaultShips[id],
});

export const shipSelector = selectorFamily<
  FleetShip | undefined,
  { fleetId: FleetId; shipId: ShipId }
>({
  key: "fleetShipSelector",
  get:
    ({ shipId }) =>
    ({ get }) => {
      const ship = get(shipsStateFamily(shipId));

      return ship;
    },
});
