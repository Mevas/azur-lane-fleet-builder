export type EquipmentTemplateData = Record<
  number,
  EquipmentTemplateDatum | EquipmentTemplateDatumWithBase
>;

export interface EquipmentTemplateDatum {
  destory_gold: number;
  destory_item: Array<number[]>;
  equip_limit: number;
  group: number;
  id: number;
  important: number;
  level: number;
  next: number;
  prev: number;
  restore_gold: number;
  restore_item: any[];
  ship_type_forbidden: number[];
  trans_use_gold: number;
  trans_use_item: Array<number[]>;
  type: number;
  upgrade_formula_id: number[];
}

export interface EquipmentTemplateDatumWithBase {
  base: number;
  destory_gold: number;
  destory_item: Array<number[]>;
  id: number;
  level: number;
  next: number;
  prev: number;
  restore_gold: number;
  restore_item: Array<number[]>;
  trans_use_gold: number;
  trans_use_item: Array<number[]>;
}
