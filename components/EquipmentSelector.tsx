import React from "react";
import { Equipment } from "../styles/utils/data";
import { WeaponSelector } from "./WeaponSelector";
import { ShipId } from "../types/ship";

export type EquipmentSelectorProps = {
  item: Equipment | null;
  shipId: ShipId;
};

export const EquipmentSelector = ({ item, shipId }: EquipmentSelectorProps) => {
  return (
    <div>
      {item?.stats.name} <WeaponSelector equippedById={shipId} />
    </div>
  );
};
