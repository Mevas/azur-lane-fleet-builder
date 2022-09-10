import { atomFamily } from "recoil";
import { Equipment } from "../types/ship";
import { equipmentData, processedEquipment } from "../styles/utils/data";

const defaultEquipment = Object.fromEntries(
  Object.entries(equipmentData).map(([id]) => [
    id,
    {
      ...processedEquipment?.[id],
      id: +id,
    },
  ])
);

export const ownedEquipmentFamilyState = atomFamily<Equipment, string>({
  key: "ownedEquipment",
  // default: (id) => defaultEquipment[id],
});
