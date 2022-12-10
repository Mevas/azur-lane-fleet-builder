import React from "react";
import { ShipSelector } from "./ShipSelector";
import { useFleet } from "../hooks/useFleet";
import { calculateAADamage } from "../utils/formulas";

export const Fleet = React.memo(function Fleet() {
  const [fleet] = useFleet();
  console.log(calculateAADamage({ fleet }));
  return (
    <div>
      {fleet.name}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        <ShipSelector position="main.left" />
        <ShipSelector position="main.center" />
        <ShipSelector position="main.right" />

        <ShipSelector position="vanguard.left" />
        <ShipSelector position="vanguard.center" />
        <ShipSelector position="vanguard.right" />
      </div>
    </div>
  );
});
