import { Enhancements, ShipData } from "../../types/ship";
import shipsJson from "../../data/ship_data_statistics.json";
import enhancementsJson from "../../data/ship_data_strengthen.json";
import skinsJson from "../../data/ship_skin_template.json";
import equipmentJson from "../../data/equip_data_statistics.json";

export const ships = Object.fromEntries(
  Object.entries(shipsJson as ShipData[]).filter(
    ([, ship]) => ship.is_character === 1
  )
  // .filter(([, ship]) => ship.name === "Laffey")
);

export const enhancements = enhancementsJson as unknown as Enhancements;

export const groups = skinsJson as Record<
  string,
  {
    painting: string;
  }
>;

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

export const getShipIconUrl = (id: number) =>
  `https://raw.githubusercontent.com/x94fujo6rpg/AzurLaneFleet/master/shipicon/${
    groups[`${+getBaseId(id)}0`].painting
  }.png`;

export const getGunIconUrl = (id: number) =>
  `https://raw.githubusercontent.com/x94fujo6rpg/AzurLaneFleet/master/equips/${
    (equipmentJson as any)[id]?.icon
  }.png`;

export const getBgUrl = (rarity: number) =>
  `https://raw.githubusercontent.com/x94fujo6rpg/AzurLaneFleet/master/ui/bg${rarity}.png`;

export const getEquipmentRarity = (id: number) =>
  getBgUrl((equipmentJson as any)[id].rarity - 1);
