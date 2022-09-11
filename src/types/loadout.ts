import { Equipment } from "../utils/data";
import { Attrs, ShipId } from "./ship";

export type LoadoutId = string;

export type Loadout = {
  id: LoadoutId;
  shipId: ShipId;
  items: Array<Equipment | null>;
  bonusAttributes: Attrs;
};
