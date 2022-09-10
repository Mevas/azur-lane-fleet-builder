import { Equipment } from "../styles/utils/data";

type Weapon = Equipment<"weapon"> | null;
type Auxiliary = Equipment<"weapon"> | null;

export type Loadout = [Weapon, Weapon, Weapon, Auxiliary, Auxiliary];
