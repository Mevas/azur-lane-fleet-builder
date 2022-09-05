import { clamp } from "./numeric";

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
