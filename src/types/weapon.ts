export type WeaponData = Record<number, WeaponDatum | WeaponDatumWithBase>;

export type WeaponDatum = {
  action_index: ActionIndex;
  aim_type: number;
  angle?: number;
  attack_attribute: number;
  attack_attribute_ratio: number;
  auto_aftercast: number;
  axis_angle?: number;
  barrage_ID: number[];
  bullet_ID: number[];
  charge_param: [] | ChargeParamClass | string;
  corrected: number;
  damage: number;
  effect_move?: number;
  expose: number;
  fire_fx: FireFx;
  fire_fx_loop_type: number;
  fire_sfx: FireSfx;
  id: number;
  initial_over_heat: number;
  min_range?: number;
  name: string;
  oxy_type?: number[];
  precast_param: any[] | PrecastParamClass;
  queue: number;
  range: number;
  recover_time: number;
  reload_max: number;
  search_condition?: number[];
  search_type?: number;
  shakescreen: number;
  spawn_bound: number[] | SpawnBoundEnum;
  suppress: number;
  torpedo_ammo: number;
  type: number;
};

export enum ActionIndex {
  Attack = "attack",
  Attack1 = "attack1",
  Attack2 = "attack2",
  AttackMain = "attack_main",
  Empty = "",
  Fangyu = "fangyu",
  Punch1 = "punch1",
  Punch2 = "punch2",
  Skill = "skill",
  Skill2 = "skill2",
  Stand = "stand",
}

export interface ChargeParamClass {
  lockTime: number;
  maxLock: number;
}

export enum FireFx {
  CAFire = "CAFire",
  CLFire = "CLFire",
  Empty = "",
  Fangkongpaohuoshe = "fangkongpaohuoshe",
  Fangkongpaohuoshe2 = "fangkongpaohuoshe2",
  ShenyuanFire01 = "shenyuanFire01",
  Tiankongjiguang = "tiankongjiguang",
  ZhongcaizhePunch02Beiji = "zhongcaizhe_punch02beiji",
  ZhongcaizhePunch04Beiji = "zhongcaizhe_punch04beiji",
  Zhupao = "zhupao",
}

export enum FireSfx {
  BattleAirAtk = "battle/air-atk",
  BattleCannon155Mm = "battle/cannon-155mm",
  BattleCannon203Mm = "battle/cannon-203mm",
  BattleCannon356Mm = "battle/cannon-356mm",
  BattleCannonAir = "battle/cannon-air",
  BattleCannonMain = "battle/cannon-main",
  BattleRaser = "battle/raser",
  Empty = "",
}

export interface PrecastParamClass {
  fx: Fx;
  armor?: number;
  isBound?: boolean;
  time?: number;
  alertTime?: number;
}

export enum Fx {
  Jineng = "jineng",
  Jinengenemy = "jinengenemy",
  PlaneMiaozhun = "plane_miaozhun",
  None = "None",
}

export enum SpawnBoundEnum {
  Antiaircraft = "antiaircraft",
  Cannon = "cannon",
  Cannon1 = "cannon1",
  Cannon2 = "cannon2",
  Cannon3 = "cannon3",
  Lighting = "lighting",
  Plane = "plane",
  Torpedo = "torpedo",
  Vicegun = "vicegun",
}

export interface WeaponDatumWithBase {
  base: number;
  damage?: number;
  id: number;
  name?: string;
  reload_max?: number;
  bullet_ID?: number[];
  corrected?: number;
  barrage_ID?: number[];
  fire_fx_loop_type?: number;
  expose?: number;
  fire_fx?: FireFx;
  range?: number;
  action_index?: ActionIndex;
  aim_type?: number;
  angle?: number;
  attack_attribute?: number;
  attack_attribute_ratio?: number;
  auto_aftercast?: any[] | number;
  axis_angle?: number;
  charge_param?: Param | string;
  effect_move?: number;
  fire_sfx?: FireSfx;
  initial_over_heat?: number;
  min_range?: number;
  oxy_type?: number[];
  precast_param?: any[] | Param | string;
  queue?: number;
  recover_time?: number;
  search_condition?: number[];
  search_type?: number;
  shakescreen?: number;
  spawn_bound?: SpawnBoundEnum;
  suppress?: number;
  torpedo_ammo?: number;
  type?: number;
}

export interface Param {
  armor?: number;
  fx: Fx;
  isBound?: boolean;
  time: number;
  alertTime?: number;
}
