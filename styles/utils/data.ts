import { Enhancements, ShipData } from "../../types/ship";
import shipsJson from "../../data/ship_data_statistics.json";
import enhancementsJson from "../../data/ship_data_strengthen.json";
import skinsJson from "../../data/ship_skin_template.json";
import equipmentJson from "../../data/equip_data_statistics.json";
import weaponJson from "../../data/weapon_property.json";
import limitBreakJson from "../../data/ship_data_breakout.json";
import shipTemplateJson from "../../data/ship_data_template.json";
import barrageTemplateJson from "../../data/barrage_template.json";

import {
  WeaponData,
  WeaponDatum,
  WeaponDatumWithBase,
} from "../../types/weapon";
import {
  EquipmentData,
  EquipmentDatum,
  EquipmentDatumWithBase,
} from "../../types/equipment";
import { LimitBreakData } from "../../types/limitBreak";
import { ShipTemplateData } from "../../types/shipTemplate";
import { getMaxEquipmentLevel } from "./constants";
import { BarrageTemplate, BarrageTemplateData } from "../../types/barrage";

export const ships = Object.fromEntries(
  Object.entries(shipsJson as ShipData[]).filter(
    ([, ship]) => ship.is_character === 1
  )
);

export const enhancements = enhancementsJson as unknown as Enhancements;
export const equipmentData = equipmentJson as unknown as EquipmentData;
export const weaponData = weaponJson as unknown as WeaponData;
export const limitBreakData = limitBreakJson as unknown as LimitBreakData;
export const shipTemplateData = shipTemplateJson as unknown as ShipTemplateData;
export const barrageTemplateData =
  barrageTemplateJson as unknown as BarrageTemplateData;

export const groups = skinsJson as Record<
  string,
  {
    painting: string;
  }
>;

export const getBaseId = (id: number) => id.toString().slice(0, -1);

export const getShip = (id: number, options: { lb: number }) => {
  const groupId = getBaseId(id);

  if (options.lb < 0 || options.lb > 3) {
    throw Error("Invalid LB value");
  }

  const shipId = +`${groupId}${options.lb + 1}`;

  const limitBreaks = [4, 1, 2, 3].map(
    (num) => limitBreakData[+`${groupId}${num}`]
  );
  const template = shipTemplateData[shipId];
  // For some reason, the buff to extra max slots from a LB can exist in the `hide_buff_list` array instead of just being in `base_list`
  const stats = {
    ...ships[shipId],
    base_list: ships[shipId].base_list.map((max, index) =>
      (template as any)[`equip_${index + 1}`].includes(4)
        ? max + template.hide_buff_list[0]
        : max
    ),
  };

  return {
    id,
    stats,
    limitBreaks,
    template,
  };
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

export type EquipmentType = "weapon" | "aux";

export type WeaponProperties = WeaponDatum & WeaponDatumWithBase;
export type EquipmentStats = EquipmentDatum & EquipmentDatumWithBase;

export type GetEquipmentReturn<TType extends EquipmentType> = {
  stats: EquipmentStats;
  properties: TType extends "weapon"
    ? WeaponProperties & {
        /** Weapon reload time in seconds */
        reload_time: number;
      }
    : undefined;
  maxLevel: number;
};

export const getEquipment = <TType extends EquipmentType>(
  id: number,
  options: { level: number; type?: TType }
): GetEquipmentReturn<TType> | undefined => {
  if (!equipmentData[id + options.level]) {
    return;
  }

  const equipment = {
    maxLevel: getMaxEquipmentLevel(
      equipmentData[id].rarity,
      equipmentData[id].tech
    ),
    stats: {
      ...equipmentData[id],
      ...equipmentData[id + options.level],
    },
    properties:
      options.type === "weapon"
        ? {
            ...weaponData[id],
            ...weaponData[id + options.level],
          }
        : undefined,
  } as GetEquipmentReturn<TType>;

  if (equipment.properties) {
    equipment.properties.reload_time = equipment.properties.reload_max / 150;
  }

  return equipment;
};

export type Equipment<TType extends EquipmentType> = Exclude<
  ReturnType<typeof getEquipment<TType>>,
  undefined
>;
export type Gun = Equipment<"weapon">;

// Doesn't take into account barrage.primal_repeat * barrage.delay since they don't affect the actual moment reloading starts
export const getVolleyTime = (barrage: BarrageTemplate) => {
  return barrage.senior_delay * barrage.senior_repeat;
};

// function intersection(a: string[], b: string[]) {
//   const setA = new Set(a);
//   return b.filter((value) => setA.has(value));
// }

// const keys = Object.values(weaponData)
//   .filter((d) => !d.base)
//   .map((v) => Object.keys(v));
// // console.log(keys.reduce((acc, curr) => intersection(acc, curr), keys[0]));
// console.log(Object.values(equipmentData).filter((d) => d.base));
