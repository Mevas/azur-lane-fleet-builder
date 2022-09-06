export type BarrageTemplateData = Record<number, BarrageTemplate>;

export interface BarrageTemplate {
  angle: number;
  delay: number;
  delta_angle: number;
  delta_delay: number;
  delta_offset_x: number;
  delta_offset_z: number;
  first_delay: number;
  id: number;
  offset_prioritise: boolean;
  offset_x: number;
  offset_z: number;
  primal_repeat: number;
  random_angle?: boolean;
  senior_delay: number;
  senior_repeat: number;
  trans_ID: number;
}
