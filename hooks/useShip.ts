import { Intimacy } from "../types/ship";
import {
  affinity,
  attributePosition,
  attributes,
} from "../styles/utils/constants";
import { enhancements, getBaseId, getShipById } from "../styles/utils/data";
import { useEffect, useMemo, useState } from "react";

const calculateStat = ({
  stat,
  level,
  intimacy,
  enhancement,
}: {
  stat: { value: number; growth: number };
  level: number;
  intimacy: Intimacy;
  enhancement: number;
}) => {
  return (
    (stat.value + ((level - 1) * stat.growth) / 1000 + enhancement) *
    affinity[intimacy]
  );
};

export const useShip = (id?: number, options?: { lb?: number }) => {
  const [level, setLevel] = useState<number>(100);
  const [intimacy, setIntimacy] = useState<Intimacy>("love");
  const [enhanced, setEnhanced] = useState<boolean>(true);
  const [lb, setLb] = useState<number>(options?.lb ?? 0);

  const shipData = id ? getShipById(id, { lb }) : undefined;

  useEffect(() => {
    setLb(
      level <= 70
        ? 0
        : level > 70 && level <= 80
        ? 1
        : level > 80 && level <= 90
        ? 2
        : 3
    );
  }, [level]);

  const stats = useMemo(() => {
    if (!shipData) {
      return;
    }

    return Object.fromEntries(
      Object.entries(attributes).map(([key, values], index) => {
        const attributeEnhancePosition = values[3];
        const enhanceable = !!attributeEnhancePosition;

        return [
          key,
          Math.floor(
            calculateStat({
              stat: {
                value: shipData.attrs[index],
                growth: shipData.attrs_growth[index],
              },
              level,
              intimacy,
              enhancement:
                enhanced && enhanceable
                  ? enhancements[getBaseId(shipData.id)].durability[
                      attributePosition[attributeEnhancePosition]
                    ]
                  : 0,
            })
          ),
        ];
      })
    );
  }, [enhanced, intimacy, level, shipData]);

  return {
    raw: shipData,
    stats,
    level,
    intimacy,
    enhanced,
    setLevel,
    setIntimacy,
    setEnhanced,
  };
};
