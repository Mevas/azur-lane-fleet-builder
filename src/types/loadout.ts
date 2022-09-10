import { Equipment } from "../utils/data";
import { ShipId } from "./ship";

export type LoadoutId = string;

export type Loadout = {
  id: LoadoutId;
  shipId: ShipId;
  items: Array<Equipment | null>;
};
