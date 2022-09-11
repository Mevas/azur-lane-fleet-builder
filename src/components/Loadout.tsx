import React from "react";
import { LoadoutId } from "../types/loadout";
import { useLoadout } from "../hooks/useLoadout";
import { EquipmentSelector } from "./EquipmentSelector";
import { ShipId } from "../types/ship";

export type LoadoutProps = {
  id: LoadoutId;
  shipId: ShipId;
};

export const Loadout = ({ id, shipId }: LoadoutProps) => {
  const [loadout, { setItem }] = useLoadout(id);

  return (
    <div>
      {loadout.items.map((item, index) => (
        <EquipmentSelector
          item={item}
          shipId={shipId}
          key={index}
          setItem={setItem}
          loadout={loadout}
          position={index}
        />
      ))}
    </div>
  );
};
