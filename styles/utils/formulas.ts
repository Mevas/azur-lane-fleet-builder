export type CalcualteCriticalChanceParams = {
  attacker: {
    hit: number;
    luck: number;
    level: number;
    /** Flat bonus coming from skills / equipment */
    bonus: number;
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
    attacker.bonus
  );
};
