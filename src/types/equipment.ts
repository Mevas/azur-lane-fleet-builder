export type EquipmentId = string;

/* Raw game data */
export type EquipmentData = Record<number, EquipmentDatum>;

export interface EquipmentDatum {
  ammo: number;
  ammo_icon: number[];
  ammo_info: Array<number[]>;
  descrip: string;
  equip_info: Array<number[] | number>;
  equip_parameters: any[] | EquipParameters;
  hidden_skill_id: number[];
  icon: string;
  id: number;
  label: string[];
  name: string;
  nationality: number;
  part_main: number[];
  part_sub: number[];
  property_rate: any[];
  rarity: number;
  skill_id: number[];
  speciality: Speciality;
  tech: number;
  torpedo_ammo: number;
  type: number;
  value_2: number;
  value_3: number;
  weapon_id: number[];
  damage?: string;
  attribute_3?: Attribute;
  attribute_2?: Attribute;
  attribute_1?: Attribute;
  value_1?: string;
}

export enum Attribute {
  Air = "air",
  Antiaircraft = "antiaircraft",
  Antisub = "antisub",
  Cannon = "cannon",
  Dodge = "dodge",
  Durability = "durability",
  Hit = "hit",
  Luck = "luck",
  OxyMax = "oxy_max",
  RAIDDistance = "raid_distance",
  Reload = "reload",
  Speed = "speed",
  Torpedo = "torpedo",
}

export interface EquipParameters {
  ambush_extra?: number;
  avoid_extra?: number;
  range?: number;
  hunting_lv?: number;
}

export enum Speciality {
  Air = "Air",
  AntiAir = "Anti-Air",
  AntiSubmarine = "Anti\nsubmarine",
  Bomber = "Bomber",
  Firepower = "Firepower",
  Lock = "Lock",
  NA = "N/A",
  Normal = "Normal",
  Scatter = "Scatter",
  Torpedo = "Torpedo",
  Volley = "Volley",
  无 = "无",
  空战 = "空战",
  跨射 = "跨射",
  轰炸 = "轰炸",
  锁定 = "锁定",
  雷击 = "雷击",
}

export interface EquipmentDatumWithBase {
  base: number;
  damage?: string;
  hidden_skill_id?: any[];
  id: number;
  name?: string;
  weapon_id?: number[];
  ammo_icon?: number[];
  descrip?: string;
  icon?: string;
  value_1?: string;
  value_2?: number;
  anti_siren?: number;
  attribute_2?: string;
  torpedo_ammo?: number;
  equip_parameters?: EquipParameters;
  skill_id?: number[];
  ammo_info?: Array<number[]>;
  speciality?: string;
  label?: string[];
  type?: number;
}
