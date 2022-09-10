export type ShipTemplateData = Record<number, ShipTemplate>;

export interface ShipTemplate {
  airassist_time: number[];
  buff_list: number[];
  buff_list_display: number[];
  can_get_proficency: number;
  energy: number;
  equip_1: number[];
  equip_2: number[];
  equip_3: number[];
  equip_4: number[];
  equip_5: number[];
  equip_id_1: number;
  equip_id_2: number;
  equip_id_3: number;
  group_type: number;
  hide_buff_list: number[];
  id: number;
  max_level: number;
  oil_at_end: number;
  oil_at_start: number;
  specific_type: SpecificType[];
  star: number;
  star_max: number;
  strengthen_id: number;
  type: number;
}

export enum SpecificType {
  Aux = "AUX",
  Gnr = "GNR",
  Torp = "TORP",
}
