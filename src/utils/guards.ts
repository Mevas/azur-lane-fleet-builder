import { Equipment } from "./data";

export const isWeapon = (
  equipment: Equipment<"weapon"> | Equipment<"aux"> | null
): equipment is Equipment<"weapon"> =>
  (equipment as Equipment<"weapon">)?.properties !== undefined;
