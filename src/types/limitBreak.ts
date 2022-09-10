export type LimitBreakData = Record<number, LimitBreak>;

export interface LimitBreak {
  breakout_id: number;
  breakout_view: string;
  icon: string;
  id: number;
  level: number;
  pre_id: number;
  ultimate_bonus: UltimateBonus[];
  use_char: number;
  use_char_num: number;
  use_gold: number;
  use_item: any[];
  weapon_ids: number[];
}

export enum UltimateBonus {
  Aux = "AUX",
  Gnr = "GNR",
  Torp = "TORP",
}
