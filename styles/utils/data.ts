import { Enhancements, ShipData } from "../../types/ship";
import shipsJson from "../../data/ship_data_statistics.json";
import enhancementsJson from "../../data/ship_data_strengthen.json";

export const ships = Object.fromEntries(
  Object.entries(shipsJson as ShipData[]).filter(
    ([, ship]) => ship.is_character === 1
  )
);

export const enhancements = enhancementsJson as unknown as Enhancements;

export const getBaseId = (id: number) => id.toString().slice(0, -1);

export const getShipById = (
  id: number,
  options?: { lb?: number }
): ShipData => {
  const groupId = getBaseId(id);
  const lb = options?.lb ?? 0;

  if (lb < 0 || lb > 3) {
    throw Error("Invalid LB value");
  }

  return Object.entries(ships)
    .filter(([, ship]) => ship.id.toString().startsWith(groupId))
    .map(([, s]) => s)[lb];
};
