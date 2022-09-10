export type BulletTemplateData = Record<number, BulletTemplate>;

export interface BulletTemplate {
  DMG_font: Array<number[]>;
  acceleration: AccelerationElement[] | PurpleAcceleration;
  alert_fx: AlertFx;
  ammo_type: number;
  antisub_enhancement: number;
  attach_buff: AttachBuff[];
  cld_box: number[];
  cld_offset: number[];
  damage_type: number[];
  effect_type: number;
  extra_param: any[] | ExtraParamClass | string;
  hit_fx: Fx;
  hit_sfx: Sfx;
  hit_type: any[] | HitTypeClass;
  id: number;
  miss_fx: Fx;
  miss_sfx: Sfx;
  modle_ID: string;
  out_bound: number;
  pierce_count: number;
  random_damage_rate: number;
  range: number;
  range_offset: number;
  type: number;
  velocity: number;
}

export interface AccelerationElement {
  flip?: boolean;
  t: number;
  u: number;
  v: number;
  "1"?: number;
}

export interface PurpleAcceleration {
  tracker?: Tracker;
  "1"?: AccelerationElement;
  "2"?: AccelerationElement;
  "3"?: AccelerationElement;
  circle?: Circle;
}

export interface Circle {
  antiClockWise: boolean;
  center: Center;
  centripetalSpeed: number;
}

export interface Center {
  x: number;
  y: number;
  z: number;
}

export interface Tracker {
  angular: number;
  range: number;
}

export enum AlertFx {
  AlertArea = "AlertArea",
  ChongfengzhanYujing = "chongfengzhan_yujing",
  Empty = "",
  HedandajiWarning = "Hedandaji_warning",
  MusicAlertArea = "music_AlertArea",
  TorAlert = "TorAlert",
  WeixingjiguangWarning = "weixingjiguang_warning",
}

export interface AttachBuff {
  buff_id: number;
  flare?: boolean;
  friendly?: boolean;
  level?: number;
  rant?: number;
  effect_id?: string;
  hit_ignore?: boolean;
}

export interface ExtraParamClass {
  gravity?: number;
  shrapnel?: ShrapnelClass;
  effectSwitchHeight?: number;
  velocity_offset?: number;
  barrage_ID?: number;
  bullet_ID?: number;
  flare?: boolean;
  airdrop?: boolean;
  diveFilter?: number[];
  launchVrtSpeed?: number;
  offsetX?: number;
  randomOffsetX?: number;
  randomOffsetZ?: number;
  accuracy?: Accuracy;
  fixToRange?: boolean;
  offsetY?: number;
  dropOffset?: boolean;
  friendlyFire?: boolean;
  targetOffsetZ?: number;
  lastTime?: number;
  barrageLowPriority?: boolean;
  barragePriority?: boolean;
  timeToExplode?: number;
  offsetZ?: number;
  ignoreShield?: boolean;
  mirror?: boolean;
  ignoreB?: boolean;
  targetOffsetX?: number;
  tag?: string[];
  alert_duration?: number;
  buff_id?: number;
  exploDMG?: number;
  force?: number;
  knockBack?: boolean;
  fragile?: boolean;
  cldMax?: number;
  scaleSpeed?: number;
  randomSpeed?: number;
  randomLaunchOffsetX?: number;
  randomLaunchOffsetZ?: number;
  velocity_offsetF?: number;
  "1"?: Bullet;
  "2"?: Bullet;
  "3"?: Bullet;
  indiscriminate?: boolean;
  RandomLaunchOffsetZ?: number;
  fallTime?: number;
  launchRiseTime?: number;
  aim_time?: number;
  attack_time?: number;
}

export interface Bullet {
  barrage_ID: number;
  bullet_ID: number;
  emitterType: EmitterType;
  inheritAngle?: number;
  initialSplit?: boolean;
  reaim?: boolean | number;
  damage?: number;
}

export enum EmitterType {
  BattleBulletEmitter = "BattleBulletEmitter",
}

export enum Accuracy {
  ChargeBulletAccuracy = "chargeBulletAccuracy",
}

export type ShrapnelClass = Record<string, Bullet> | Bullet | Bullet[];

export enum Fx {
  Baiquan2 = "Baiquan_2",
  Banai01Hit = "banai01_hit",
  BlackholeHit = "blackhole_hit",
  BlackholeLoop = "blackhole_loop",
  BlackholeRed = "blackhole_red",
  BlueHit = "BlueHit",
  BlueHitWithArc = "BlueHitWithArc",
  BlueHitWithArc2 = "BlueHitWithArc2",
  BlueHitWithArc3 = "BlueHitWithArc3",
  BlueMiss = "BlueMiss",
  BulletBaozha = "bullet_baozha",
  BulletELFIceHit = "bullet_elf_ice_hit",
  CAHit = "CAHit",
  CLHit = "CLHit",
  ChongfengzhanBeiji = "chongfengzhan_beiji",
  CiweidanChufa = "ciweidan_chufa",
  CiweidanLuoshui = "ciweidan_luoshui",
  Clhit = "Clhit",
  Daduan = "daduan",
  Empty = "",
  Emptyfx = "emptyfx",
  Fangkongbaozha = "fangkongbaozha",
  FuerjiaBaozha = "fuerjia_baozha",
  FumiluluHit = "fumilulu_hit",
  GulitejinengEnergyPulseHit = "gulitejineng_EnergyPulse_hit",
  HololiveHuoqiu = "hololive_huoqiu",
  Huoqiubaozha2 = "huoqiubaozha2",
  JianqiShouji = "jianqi_shouji",
  JianqiShoujiFire = "jianqi_shouji_fire",
  JiguangShouji = "jiguang_shouji",
  JiguangShoujiYellow = "jiguang_shouji_yellow",
  JunengshexianBeiji = "junengshexian_beiji",
  JunengshexianBeiji02 = "junengshexian_beiji02",
  KalvbudisiXuanwo = "kalvbudisi_xuanwo",
  LulutiyeHit = "lulutiye_hit",
  MaoyinHit = "maoyin_hit",
  NoEffect02 = "NoEffect02",
  None = "None",
  OrangeHit = "OrangeHit",
  PinkHit = "PinkHit",
  PlaneDaodanBaozha = "plane_daodan_baozha",
  Pofang = "pofang",
  PurpleHit = "PurpleHit",
  RedMiss = "RedMiss",
  RedShellHit = "RedShellHit",
  SaoshejiguangHit = "saoshejiguang_hit",
  ShellHit = "ShellHit",
  ShellHitBlueShort = "ShellHitBlue_short",
  ShellHitPurple = "ShellHitPurple",
  ShellHitPurpleShort = "ShellHitPurple_short",
  ShellHitSmall = "ShellHitSmall",
  ShellMiss = "ShellMiss",
  ShellMissBig = "ShellMissBig",
  ShellMissBig1 = "ShellMissBig1",
  ShellMissBlueFire = "ShellMissBlueFire",
  ShellMissBlueFire02 = "ShellMissBlueFire02",
  ShellMissPoison = "ShellMissPoison",
  Shenshuizhadan = "shenshuizhadan",
  ShenyuanjiguangShouji = "shenyuanjiguang_shouji",
  Shuangzi = "shuangzi",
  TorpedoHit3 = "TorpedoHit3",
  TorpedoHitBlue = "TorpedoHitBlue",
  WhiteShellHit1 = "WhiteShellHit1",
  XiaoguanghuiShengguangSmall = "xiaoguanghui_shengguang_small",
  YellowHit = "YellowHit",
  ZhaomingdanBaiquan2 = "zhaomingdan_baiquan_2",
}

export enum Sfx {
  BattleHit = "battle/hit",
  BattleRaser = "battle/raser",
  BattleSink = "battle/sink",
  BattleTorpedoHit = "battle/torpedo-hit",
  Empty = "",
  None = "None",
  SfxBattleTorpedoHit = "battle/torpedo-hit ",
}

export interface HitTypeClass {
  range?: number;
  time?: number;
  decay?: number;
  max?: number;
  min?: number;
  interval?: number;
  height?: number;
  width?: number;
}
