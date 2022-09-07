import React from "react";
import { ShipCard } from "./ShipCard";
import { Fleet as FleetType } from "../types/ship";

export type FleetProps = {
  fleet: FleetType;
};

export const Fleet = ({ fleet }: FleetProps) => {
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
