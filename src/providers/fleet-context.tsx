import { createContext, useCallback, useMemo } from "react";
import { FleetId, fleetSelector } from "../atoms/fleets";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { Fleet, FleetShipState, Positioning } from "../types/ship";

export type FleetPosition = `${keyof Fleet["ships"]}.${keyof Positioning}`;

export const parseFleetPosition = (position: FleetPosition) => {
  const type = position.split(".")[0] as keyof Fleet["ships"];
  const _position = position.split(".")[1] as keyof Positioning;

  return { type, position: _position };
};

export type SetShip = (
  positionString: FleetPosition,
  ship: FleetShipState
) => void;

type State = {
  fleet: Fleet;
  setFleet: SetterOrUpdater<Fleet>;
  setShip: SetShip;
};

export const FleetContext = createContext<State | undefined>(undefined);

export type FleetProviderProps = React.PropsWithChildren<{ fleetId: FleetId }>;

export const FleetProvider = ({ children, fleetId }: FleetProviderProps) => {
  const [fleet, setFleet] = useRecoilState(fleetSelector(fleetId));

  const setShip: SetShip = useCallback(
    (positionString, ship) => {
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

  const value = useMemo(
    () => ({ fleet, setFleet, setShip }),
    [fleet, setFleet, setShip]
  );

  return (
    <FleetContext.Provider value={value}>{children}</FleetContext.Provider>
  );
};
