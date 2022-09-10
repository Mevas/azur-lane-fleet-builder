import { Enhancements, ShipData } from "../../types/ship";
import shipsJson from "../../data/ship_data_statistics.json";
import enhancementsJson from "../../data/ship_data_strengthen.json";
import skinsJson from "../../data/ship_skin_template.json";
import equipmentJson from "../../data/equip_data_statistics.json";
import weaponJson from "../../data/weapon_property.json";
import limitBreakJson from "../../data/ship_data_breakout.json";
import shipTemplateJson from "../../data/ship_data_template.json";
import barrageTemplateJson from "../../data/barrage_template.json";
import bulletTemplateJson from "../../data/bullet_template.json";

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
import { BulletTemplateData } from "../../types/bullet";

export const ships = Object.fromEntries(
  Object.entries(shipsJson as unknown as ShipData[]).filter(
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
export const bulletTemplateData =
  bulletTemplateJson as unknown as BulletTemplateData;

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
        ? max +
          (template.hide_buff_list[0] < 5 ? template.hide_buff_list[0] : 0)
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
  `https://raw.githubusercontent.com/x94fujo6rpg/AzurLaneFleet/master/equips/${equipmentData[id]?.icon}.png`;

export const getBgUrl = (rarity: number) =>
  `https://raw.githubusercontent.com/x94fujo6rpg/AzurLaneFleet/master/ui/bg${rarity}.png`;

export const getEquipmentRarity = (id: number) =>
  getBgUrl(equipmentData[id].rarity - 1 || 1);

export type EquipmentType = "weapon" | "aux" | undefined;

export type WeaponProperties = WeaponDatum &
  WeaponDatumWithBase & {
    /** Weapon reload time in seconds */
    reload_time: number;
  };
export type EquipmentStats = EquipmentDatum & EquipmentDatumWithBase;

export type GetEquipmentReturn<TType extends EquipmentType> = {
  stats: EquipmentStats;
  properties: TType extends "weapon"
    ? WeaponProperties
    : TType extends undefined
    ? WeaponProperties | undefined
    : undefined;
  maxLevel: number;
};

export const processedEquipment = Object.fromEntries(
  Object.entries(equipmentData).map(([_id, equipment]) => {
    const id = +_id;

    const maxLevel = getMaxEquipmentLevel(equipment.rarity, equipment.tech);

    const equipmentLevels = [];
    const weapon = weaponData[id];

    for (let level = 0; level <= maxLevel; level++) {
      const properties = weapon
        ? ({
            ...weapon,
            ...weaponData[id + level],
          } as WeaponProperties)
        : undefined;

      if (properties) {
        properties.reload_time = properties.reload_max / 150;
      }

      equipmentLevels.push({
        maxLevel: getMaxEquipmentLevel(equipment.rarity, equipment.tech),
        stats: {
          ...equipment,
          ...equipmentData[id + level],
        },
        properties,
      });
    }

    return [id, equipmentLevels];
  })
);

export const getEquipment = <TType extends EquipmentType>(
  id: number,
  options: { level: number; type?: TType }
): GetEquipmentReturn<TType> | undefined => {
  return processedEquipment?.[id]?.[options.level] as GetEquipmentReturn<TType>;
};

export type Equipment<TType extends EquipmentType = undefined> = Exclude<
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

// console.log(new Set(Object.values(equipmentData).map((e) => e.descrip)));

// const simulations = 1000;
// const buff = 40;
// const duration = 10;
// let rate = 1;
// const range = (n: number) => Array.from(Array(n).keys());
// const chances: Record<number, number> = {};
// for (let sim = 0; sim < simulations; sim++) {
//   let chance = 0.01;
//   let sum = 0;
//   let turnsBuffed = 0;
//
//   for (let i = 1; i <= 120; i += rate) {
//     if (i % rate === 0) {
//       if (Math.random() < chance) {
//         turnsBuffed = duration;
//         rate = 0.9;
//       }
//     }
//     if (turnsBuffed > 0) {
//       chances[i] = (chances[i] ?? 0) + 1;
//       sum += buff;
//       turnsBuffed--;
//     } else if (turnsBuffed === 0) {
//       rate = 1;
//     }
//   }
// }
//
// console.log(
//   Object.entries(chances)
//     .map(
//       ([moment, chanceSum]) =>
//         `{${(+moment).toFixed(1)},${+(chanceSum / simulations).toFixed(2)}}`
//     )
//     .join(",")
// );
