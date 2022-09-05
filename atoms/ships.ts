import { atom } from "recoil";
import { ObtainedShip } from "../types/ship";
import { ships } from "../styles/utils/data";

const defaultState = {
  level: 100,
  lb: 3,
  intimacy: "love",
  enhanced: true,
} as const;

export const shipsState = atom<ObtainedShip[]>({
  key: "shipsState",
  default: Object.keys(ships).map((key) => ({ ...defaultState, id: +key })),
});
