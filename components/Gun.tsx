import React, { useState } from "react";
import { clamp } from "../styles/utils/numeric";
import {
  calculateAccuracy,
  calculateCriticalChance,
} from "../styles/utils/formulas";
import weaponJson from "../data/weapon_property.json";
import { TICKS_PER_SECOND } from "../styles/utils/constants";
import equipmentJson from "../data/equip_data_statistics.json";
import { Autocomplete, TextField } from "@mui/material";
import { useShip } from "../hooks/useShip";
import Slider from "@mui/material/Slider";

const gunOptions = Object.entries(equipmentJson)
  .filter(([id, s]) => !/[^\x00-\x7F]/.test(s.name) && id < 100000)
  .filter(([, s]) => [5].includes(s.rarity))
  .map(([, s]) => ({
    label: s.name,
    id: s.id,
  }))
  .sort();

export const Gun = ({ equippedById }: { equippedById: number }) => {
  const ship = useShip(equippedById);

  const [selectedGun, setSelectedGun] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [gunRank, setGunRank] = useState(0);

  const getDmg = () => {
    if (!selectedGun || !ship.stats || !ship || !ship.raw) {
      return;
    }

    const attackerLevel = ship.level;
    const defenderLevel = 113;

    const defenderEva = 69; // Arbiter
    const defenderLck = 45; // Arbiter

    const levelDifference = clamp(attackerLevel - defenderLevel, -25, 25);

    const critRate = calculateCriticalChance({
      attacker: {
        hit: ship.stats.hit,
        luck: ship.stats.luck,
        level: ship.level,
        bonus: 0,
      },
      defender: {
        eva: defenderEva,
        luck: defenderLck,
        level: defenderLevel,
      },
    });

    const weaponsProps = weaponJson[selectedGun.id + gunRank];
    const coefficient =
      (weaponsProps.corrected ?? weaponJson[selectedGun.id].corrected ?? 100) /
      100;
    const formationBonus = -0.05;
    const fpSkillBonus = 0;
    const armorModifier = 1;
    const ammoBuff = 0.1;
    const skillBuffs = 0; // skills that increase damage generally
    const ammoTypeModifier = 0; // skills that affect ammo types
    const enemyDebuff = 0; // skills like helena's radar scan
    const hunterSkill = 0; // hull specific damage bonus
    const manual = false; // did the user manually aim
    const manualModifier = 0; // skills like JB's stuff
    const critical = critRate; // Should be the crit chance for an average damage
    const criticalModifier = 0;
    const randomBit = 1; // can be 0, 1, 2 - on average will be 1
    const maxDanger = 10;
    const isSafe = false;

    const accuracy = calculateAccuracy({
      attacker: {
        hit: ship.stats.hit,
        luck: ship.stats.luck,
        level: ship.level,
      },
      defender: {
        eva: defenderEva,
        luck: defenderLck,
        level: defenderLevel,
      },
    });

    const safeLevelAdvantage = 1 + (levelDifference + maxDanger) * 0.02;
    const dangerLevelAdvantage = 1 + levelDifference * 0.02;
    const levelAdvantage = isSafe ? safeLevelAdvantage : dangerLevelAdvantage;

    const finalDmg =
      (weaponsProps.damage *
        coefficient *
        ship.raw.equipment_proficiency[0] *
        (1 +
          (ship.stats["cannon"] / 100) * (1 + formationBonus + fpSkillBonus)) +
        randomBit) *
      armorModifier *
      levelAdvantage *
      (1 + ammoBuff + skillBuffs) *
      (1 + ammoTypeModifier) *
      (1 + enemyDebuff) *
      (1 + hunterSkill) *
      (1 + (manual ? 1 : 0) * (0.2 + manualModifier)) *
      (1 + (critical ? 1 : 0) * (0.5 + criticalModifier));

    const finalReload =
      (weaponsProps.reload_max / TICKS_PER_SECOND) *
      Math.sqrt(200 / (ship.stats.reload * (1 + 0) + 100));

    const timePerShell = 0.05;
    const shells = 5;
    const animationTime = (shells - 1) * timePerShell;
    const delayBeforeVolley = {
      dd: 0.16,
      cl: 0.18,
      ca: 0.2,
    };
    const delayAfterVolley = 0.1;

    const finalDps =
      (accuracy * finalDmg * 5) /
      (finalReload +
        animationTime +
        delayBeforeVolley["dd"] +
        delayAfterVolley);

    return {
      dmg: weaponsProps.damage,
      finalDmg: finalDmg.toFixed(2),
      dps:
        (weaponsProps.damage * coefficient * 5 * 1) / //add salvo enumeration
        (weaponsProps.reload_max / TICKS_PER_SECOND + 0.2 + 0.26),
      finalDps: finalDps.toFixed(2),
      reload: weaponsProps.reload_max / TICKS_PER_SECOND,
      finalReload,
      critRate,
      accuracy,
    };
  };

  const gun = getDmg();

  return (
    <div>
      <div style={{ width: 200 }}>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Main gun" fullWidth />
          )}
          options={gunOptions}
          onChange={(event, newValue) => {
            setSelectedGun(newValue);
          }}
          value={selectedGun}
          filterOptions={(options, state) => {
            return options.filter((o) =>
              o.label.toLowerCase().includes(state.inputValue)
            );
          }}
        />
      </div>
      <Slider
        min={0}
        max={13}
        value={gunRank}
        onChange={(event, newLevel) => {
          if (typeof newLevel !== "number") {
            return;
          }

          setGunRank(newLevel);
        }}
        valueLabelDisplay="auto"
        marks={[
          {
            value: 0,
            label: "0",
          },
          {
            value: 10,
            label: "10",
          },
          {
            value: 13,
            label: "13",
          },
        ]}
      />
      <div>{selectedGun?.id}</div>
      <div>Damage: {gun?.dmg}</div>
      <div>Damage per shot: {gun?.finalDmg}</div>
      <div>DPS: {gun?.finalDps}</div>
      <div>Reload: {gun?.finalReload.toFixed(2)}s</div>
      <div>Crit chance: {((gun?.critRate ?? 0) * 100).toFixed(2)}%</div>
      <div>Chance to hit: {((gun?.accuracy ?? 0) * 100).toFixed(2)}%</div>
    </div>
  );
};
