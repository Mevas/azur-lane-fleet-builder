import React from "react";
import { FleetId } from "../atoms/fleets";
import { useFleet } from "../hooks/useFleet";
import { ShipCard } from "./ShipCard";

export type FleetProps = {
  id: FleetId;
};

export const Fleet = ({ id }: FleetProps) => {
  const fleet = useFleet(id);

  return (
    <div>
      {fleet.name}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        <ShipCard />
        <ShipCard />
        <ShipCard />

        <ShipCard />
        <ShipCard />
        <ShipCard />
      </div>
    </div>
  );
};
