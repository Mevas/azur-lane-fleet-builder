import { affinity, nationality } from "../styles/utils/constants";

export type Stat =
  | "durability"
  | "cannon"
  | "torpedo"
  | "antiaircraft"
  | "air"
  | "reload"
  | "armor"
  | "hit"
  | "dodge"
  | "speed"
  | "luck"
  | "antisub";

export type ModifiableStat = "fp" | "trp" | "avi" | "rld";

export type Rarity = 0 | 1 | 2 | 3 | 4 | 5 | 8 | 9;

export type NumericBoolean = 0 | 1;

export type Attrs = [
  durability: number,
  cannon: number,
  torpedo: number,
  antiaircraft: number,
  air: number,
  reload: number,
  armor: number,
  hit: number,
  dodge: number,
  speed: number,
  luck: number,
  antisub: number
];

export type Ship = {
  aim_offset: [number, number, number];
  ammo: number;
  armor_type: 0 | 1 | 2;
  attack_duration: number;
  attrs: Attrs;
  attrs_growth: Attrs;
  attrs_growth_extra: Attrs;
  backyard_speed: string;
  base_list: [number, number, number];
  cld_box: [number, number, number];
  cld_offset: [number, number, number];
  default_equip_list: number[];
  depth_charge_list: number[];
  english_name: string;
  equipment_proficiency: [number, number, number];
  fix_equip_list: any[];
  hunting_range: any[][];
  huntingrange_level: number;
  id: number;
  is_character: NumericBoolean;
  lock: Stat[];
  name: string;
  nationality: keyof typeof nationality;
  oxy_cost: number;
  oxy_max: number;
  oxy_recovery: number;
  oxy_recovery_bench: number;
  parallel_max: [number, number, number];
  position_offset: [number, number, number];
  preload_count: [number, number, number];
  raid_distance: number;
  rarity: Rarity;
  scale: number;
  skin_id: number;
  star: 3 | 4 | 5 | 6;
  strategy_list: any[];
  summon_offset: number;
  tag_list: string[];
  type: number;
};

export type Affection = keyof typeof affinity;

export type Enhancement = {
  attr_exp: [number, number, number, number, number];
  durability: [number, number, number, number, number];
  id: number;
  level_exp: [number, number, number, number, number];
};

export type Enhancements = Record<string, Enhancement>;