import React from "react";
import { ShipSelector } from "./ShipSelector";
import { Fleet as FleetType } from "../types/ship";
import { useFleet } from "../hooks/useFleet";

export type FleetProps = {
  id: FleetType["id"];
};

export const Fleet = ({ id }: FleetProps) => {
  const [fleet, setShip] = useFleet(id);

  return (
    <div>
      {fleet.name}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        <ShipSelector position="main.left" setShip={setShip} fleet={fleet} />
        <ShipSelector position="main.center" setShip={setShip} fleet={fleet} />
        <ShipSelector position="main.right" setShip={setShip} fleet={fleet} />

        <ShipSelector
          position="vanguard.left"
          setShip={setShip}
          fleet={fleet}
        />
        <ShipSelector
          position="vanguard.center"
          setShip={setShip}
          fleet={fleet}
        />
        <ShipSelector
          position="vanguard.right"
          setShip={setShip}
          fleet={fleet}
        />
      </div>
    </div>
  );
};
