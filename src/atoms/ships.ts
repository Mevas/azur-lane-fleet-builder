import { atomFamily } from "recoil";
import { OwnedShip } from "../types/ship";
import { ships } from "../utils/data";

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