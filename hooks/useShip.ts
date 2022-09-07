import { Intimacy, ObtainedShip, StatName } from "../types/ship";
import {
  affinity,
  attributePosition,
  attributes,
} from "../styles/utils/constants";
import {
  enhancements,
  getBaseId,
  getShip,
  getShipIconUrl,
} from "../styles/utils/data";
import { useCallback, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { shipsState } from "../atoms/ships";

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

export const useShipState = (id: number) => {
  const [obtainedShips, setState] = useRecoilState(shipsState);

  const ship = useMemo(
    () => obtainedShips.find((ship) => ship.id === id),
    [id, obtainedShips]
  );

  if (!ship) {
    throw Error(`Invalid ship ID: ${id}`);
  }

  const set = useCallback(
    <TKey extends keyof ObtainedShip>(key: TKey, value: ObtainedShip[TKey]) =>
      setState((ships) =>
        ships.map((ship) => (ship.id === id ? { ...ship, [key]: value } : ship))
      ),
    [id, setState]
  );

  return useMemo(() => ({ ...ship, set }), [set, ship]);
};

export const useShip = (id: number) => {
  const ship = useShipState(id);

  const shipData = useMemo(() => getShip(id, { lb: ship.lb }), [id, ship.lb]);
  const iconUrl = useMemo(() => getShipIconUrl(id), [id]);

  useEffect(() => {
    ship.set(
      "lb",
      ship.level <= 70
        ? 0
        : ship.level > 70 && ship.level <= 80
        ? 1
        : ship.level > 80 && ship.level <= 90
        ? 2
        : 3
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ship.level]);

  const computedAttributes = useMemo(() => {
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
                value: shipData.stats.attrs[index],
                growth: shipData.stats.attrs_growth[index],
              },
              level: ship.level,
              intimacy: ship.intimacy,
              enhancement:
                ship.enhanced && enhanceable
                  ? enhancements[getBaseId(shipData.id)].durability[
                      attributePosition[attributeEnhancePosition]
                    ]
                  : 0,
            })
          ),
        ];
      })
    ) as Record<StatName, number>;
  }, [ship.enhanced, ship.intimacy, ship.level, shipData]);

  return useMemo(() => {
    if (!computedAttributes || !shipData) {
      console.warn("Invalid ship", id);
      return;
    }

    return {
      ...ship,
      ...shipData,
      attributes: computedAttributes,
      iconUrl,
    };
  }, [computedAttributes, iconUrl, id, ship, shipData]);
};

export type Ship = Exclude<ReturnType<typeof useShip>, undefined>;
