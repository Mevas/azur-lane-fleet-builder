import { atomFamily } from "recoil";
import { OwnedShip } from "../types/ship";
import { equipmentData, processedEquipment } from "../utils/data";

const defaultEquipment = Object.fromEntries(
  Object.entries(equipmentData).map(([id]) => [
    id,
    {
      ...processedEquipment?.[id],
      id: +id,
    },
  ])
);

export const ownedEquipmentFamilyState = atomFamily<OwnedShip, string>({
  key: "ownedEquipment",
  // default: (id) => defaultEquipment[id],
});
