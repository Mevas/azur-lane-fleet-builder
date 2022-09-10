import { useRecoilState } from "recoil";
import { FleetId, fleetSelector } from "../atoms/fleets";
import { useCallback, useMemo } from "react";
import { Fleet, FleetShipState, Positioning } from "../types/ship";

export type FleetPosition = `${keyof Fleet["ships"]}.${keyof Positioning}`;

export const parseFleetPosition = (position: FleetPosition) => {
  const type = position.split(".")[0] as keyof Fleet["ships"];
  const _position = position.split(".")[1] as keyof Positioning;

  return { type, position: _position };
};

export const useFleet = (id: FleetId) => {
  const [fleet, setFleet] = useRecoilState(fleetSelector(id));

  const setShip = useCallback(
    (positionString: FleetPosition, ship: FleetShipState) => {
      const position = parseFleetPosition(positionString);

      setFleet((currentFleet) => ({
        ...currentFleet,
        ships: {
          ...currentFleet.ships,
          [position.type]: {
            ...currentFleet.ships[position.type],
            [position.position]: ship,
          },
        },
      }));
    },
    [setFleet]
  );

  return useMemo(() => [fleet, setShip] as const, [fleet, setShip]);
};

export type SetShip = ReturnType<typeof useFleet>[1];
