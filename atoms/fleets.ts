import { atom } from "recoil";
import { Fleet } from "../types/ship";

export const fleetsState = atom<Array<Fleet>>({
  key: "fleetsState",
  default: [],
});
