import React from "react";
import { useLoadout } from "../hooks/useLoadout";
import { EquipmentSelector } from "./EquipmentSelector";
import { ShipId } from "../types/ship";

export type LoadoutProps = {
  shipId: ShipId;
};

export const Loadout = ({ shipId }: LoadoutProps) => {
  const [loadout] = useLoadout();

  return (
    <div>
      {loadout.items.map((item, index) => (
        <EquipmentSelector
          item={item}
          shipId={shipId}
          key={index}
          loadout={loadout}
          position={index}
        />
      ))}
    </div>
  );
};
