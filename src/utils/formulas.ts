import { average, clamp } from "./numeric";
import { barrageTemplateData, Equipment, getVolleyTime } from "./data";
import {
  delayAfterVolley,
  delayBeforeVolley,
  RELOAD_CONSTANT,
} from "./constants";
import { Ship } from "../hooks/useShip";
import { StatName } from "../types/ship";
import { Loadout } from "../types/loadout";
import { calculateBonusAttributes } from "../atoms/loadouts";

export type CalcualteCriticalChanceParams = {
  attacker: {
    hit: number;
    luck: number;
    level: number;
    /** Flat bonus coming from skills / equipment */
    bonus?: number;
  };
  defender: {
    eva: number;
    luck: number;
    level: number;
  };
};

export const calculateCriticalChance = ({
  attacker,
  defender,
}: CalcualteCriticalChanceParams) => {
  return (
    0.05 +
    attacker.hit / (attacker.hit + defender.eva + 2000) +
    (attacker.luck - defender.luck + attacker.level - defender.level) / 5000 +
    (attacker.bonus ?? 0)
  );
};

export type CalculateAccuracyParams = {
  attacker: {
    hit: number;
    luck: number;
    level: number;
    bonuses?: {
      /** Any ship skills that affect Accuracy against a specific hull type, such as Swiftsure's "Advanced Fire Control System" skill */
      accuracyVsShipTypeSkill?: number;
      /** Ship skills that directly affect Evasion Rate, such as smoke screens or Aurora's "Dawn" */
      evasionRateSkill?: number;
    };
  };
  defender: {
    eva: number;
    luck: number;
    level: number;
  };
};

export const calculateAccuracy = ({
  attacker,
  defender,
}: CalculateAccuracyParams) => {
  return clamp(
    0.1 +
      attacker.hit / (attacker.hit + defender.eva + 2) +
      (attacker.luck - defender.luck + attacker.level - defender.level) / 1000 +
      (attacker.bonuses?.accuracyVsShipTypeSkill ?? 0) -
      (attacker.bonuses?.evasionRateSkill ?? 0),
    0.1,
    1
  );
};

type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

export type CalculateDamageParams = {
  attacker: Ship;
  loadout: Loadout;
  options?: {
    isCritical?: boolean;
    ammo?: number;
    /** Whether or not the user is playing on manual */
    isManual?: boolean;
    /** Bonus from the chosen formation */
    formationBonus?: number;
    fpSkillBonus?: number;
    skillBuffs?: number;
    /** Bonus from any skill that grants a damage bonus to certain shell types */
    ammoTypeModifier?: number;
    /** Debuff percentage from skills - i.e. Helena */
    enemyDebuff?: number;
    hunterSkill?: number;
    /** Random bit generated by the game - average is 1 */
    randomBit?: 0 | 1 | 2;
    /** Bonus from any skill that grants a damage bonus while playing on manual */
    manualModifier?: number;
    /** Bonus from any skill that grants a critical multiplier bonus */
    criticalModifier?: number;
    /** Bonus from any skill that grants a reload time bonus */
    reloadSkillBonus?: number;
  };
};

export type Damage = {
  perBullet: number;
  reload: {
    weapon: number;
    total: number;
  };
  dps: number;
  shells: number;
  against: (options: {
    defender: Pick<Ship, "level"> & {
      attributes: Pick<Ship["attributes"], "dodge" | "luck">;
    };
    zone: { safe: boolean; maxDanger: number };
  }) => DamageAgainstEnemy;
};

export type DamageAgainstEnemy = Omit<Damage, "against" | "perBullet"> & {
  perBullet: {
    base: number;
    average: number;
  };
  accuracy: number;
  criticalChance: number;
  criticalMultiplier: number;
};

export const calculateDamage = ({
  attacker,
  options,
  loadout,
}: CalculateDamageParams): Damage => {
  const bonusAttributes = calculateBonusAttributes(loadout);
  const totalAttributes = Object.fromEntries(
    Object.entries(attacker.attributes).map(([stat, value], index) => [
      stat,
      value + bonusAttributes[index],
    ])
  ) as Record<StatName, number>;

  const gun = loadout.items[0] as unknown as Equipment<"weapon">;

  const ammo = options?.ammo ?? 3; // Default to a 0% buff

  const formationBonus = options?.formationBonus ?? -0.05;
  const fpSkillBonus = options?.fpSkillBonus ?? 0;
  const armorModifier = 1; // TODO
  const ammoBuff = ammo > 3 ? 0.1 : ammo > 0 ? 0 : -0.5;
  const skillBuffs = options?.skillBuffs ?? 0; // skills that increase damage generally
  const ammoTypeModifier = options?.ammoTypeModifier ?? 0; // skills that affect ammo types
  const enemyDebuff = options?.enemyDebuff ?? 0; // skills like helena's radar scan
  const hunterSkill = options?.hunterSkill ?? 0; // hull specific damage bonus
  const manualModifier = options?.manualModifier ?? 0; // skills like JB's stuff
  const criticalModifier = options?.criticalModifier ?? 0;
  const randomBit = options?.randomBit ?? 1; // can be 0, 1, 2 - on average will be 1

  const criticalMultiplier = 1.5 + criticalModifier;
  const coefficient = (gun.properties.corrected ?? 100) / 100;

  const baseDamage =
    (gun.properties.damage *
      coefficient *
      attacker.stats.equipment_proficiency[0] *
      (1 +
        (totalAttributes.cannon / 100) * (1 + formationBonus + fpSkillBonus)) +
      randomBit) *
    (1 + ammoBuff + skillBuffs) *
    (1 + ammoTypeModifier) *
    (1 + enemyDebuff) *
    (1 + hunterSkill) *
    (1 + (options?.isManual ? 1 : 0) * (0.2 + manualModifier));

  const reloadSkillBonus = options?.reloadSkillBonus ?? 0;

  const reloadTime =
    gun.properties.reload_time *
    RELOAD_CONSTANT *
    Math.sqrt(200 / (totalAttributes.reload * (1 + reloadSkillBonus) + 100));

  const barrages = gun.properties.barrage_ID.map(
    (id) => barrageTemplateData[id]
  );
  const volleyTimes = barrages.map((barrage) => getVolleyTime(barrage));
  const averageVolleyTime = average(volleyTimes);

  const shells =
    (barrages[0].senior_repeat + 1) *
    (barrages[0].primal_repeat + 1) *
    attacker.stats.base_list[0]; // TODO: change the base list slot when adding equipability

  const totalReloadTime =
    reloadTime + averageVolleyTime + delayBeforeVolley["dd"] + delayAfterVolley;
  const finalDps = (baseDamage * shells) / totalReloadTime;

  return {
    perBullet:
      baseDamage * (1 + (options?.isCritical ? 1 : 0) * criticalMultiplier),
    dps: finalDps,
    shells,
    reload: {
      weapon: reloadTime,
      total: totalReloadTime,
    },
    against: ({ defender, zone }) => {
      const levelDifference = attacker.level - defender.level;
      const clampedLevelDifference = clamp(levelDifference, -25, 25);

      const safeLevelAdvantage =
        1 + (clampedLevelDifference + zone.maxDanger) * 0.02;
      const dangerLevelAdvantage = 1 + clampedLevelDifference * 0.02;
      const levelAdvantage = zone.safe
        ? safeLevelAdvantage
        : dangerLevelAdvantage;

      const accuracy = calculateAccuracy({
        attacker: {
          hit: totalAttributes.hit,
          luck: totalAttributes.luck,
          level: attacker.level,
        },
        defender: {
          eva: defender.attributes.dodge,
          luck: defender.attributes.luck,
          level: defender.level,
        },
      });

      const critRate = !options?.isCritical
        ? calculateCriticalChance({
            attacker: {
              hit: totalAttributes.hit,
              luck: totalAttributes.luck,
              level: attacker.level,
              bonus: 0,
            },
            defender: {
              eva: defender.attributes.dodge,
              luck: defender.attributes.luck,
              level: defender.level,
            },
          })
        : 1;

      let base = baseDamage * levelAdvantage * armorModifier;

      const averageCriticalMultiplier = (criticalMultiplier - 1) * critRate + 1;

      const average = base * accuracy * averageCriticalMultiplier;

      const averageDps = (average * shells) / totalReloadTime;

      return {
        perBullet: {
          base: base * (options?.isCritical ? criticalMultiplier : 1),
          average,
        },
        reload: {
          weapon: reloadTime,
          total: totalReloadTime,
        },
        dps: averageDps,
        accuracy,
        criticalChance: critRate,
        criticalMultiplier,
        shells,
      };
    },
  };
};

// const test = Object.values(equipmentData).slice(0, 100);
// let suite = new Suite();
// suite
//   .add("Reduce", () => {
//     test.reduce(
//       (acc, equip) => {
//         if (!(equip.name && !/[^\x00-\x7F]/.test(equip.name))) {
//           return acc;
//         }
//
//         acc.push({
//           label: equip.name,
//           id: equip.id,
//         });
//
//         return acc;
//       },
//       [] as Array<{
//         label: string;
//         id: number;
//       }>
//     );
//   })
//   .add("No reduce", () => {
//     test
//       .filter((equip) => equip.name && !/[^\x00-\x7F]/.test(equip.name))
//       .map((equip) => ({
//         label: equip.name,
//         id: equip.id,
//       }));
//   })
//   .on("cycle", function (event: any) {
//     console.log(String(event.target));
//   })
//   .on("complete", function () {
//     // @ts-ignore
//     console.log("Fastest is: " + this.filter("fastest").map("name"));
//   })
//   .run();
