import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import weaponJson from "../data/weapon_property.json";
import equipmentJson from "../data/equip_data_statistics.json";

import {
  Autocomplete,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Intimacy, ShipData } from "../types/ship";
import {
  affinity,
  nationality,
  TICKS_PER_SECOND,
} from "../styles/utils/constants";
import { clamp } from "../styles/utils/numeric";
import {
  calculateAccuracy,
  calculateCriticalChance,
} from "../styles/utils/formulas";
import { ships } from "../styles/utils/data";
import { useShip } from "../hooks/useShip";

const getName = (ship: ShipData) => {
  return `${ship.name} (${nationality[ship.nationality]})`;
};

const gunOptions = Object.entries(equipmentJson)
  .filter(([id, s]) => !/[^a-zA-Z0-9\s.]/.test(s.name) && id < 100000)
  .filter(([, s]) => s.rarity === 5)
  .map(([, s]) => ({
    label: s.name,
    id: s.id,
  }))
  .sort();

const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 70,
    label: "70",
  },
  {
    value: 80,
    label: "80",
  },
  {
    value: 90,
    label: "90",
  },
  {
    value: 100,
    label: "100",
  },
  {
    value: 120,
    label: "120",
  },
  {
    value: 125,
    label: "125",
  },
];

const options = Object.entries(ships)
  .filter(([id]) => id.endsWith("1"))
  .map(([, s]) => ({
    label: getName(s),
    id: s.id,
  }))
  .sort();

const Home: NextPage = () => {
  const [selectedShip, setSelectedShip] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [selectedGun, setSelectedGun] = useState<{
    label: string;
    id: number;
  } | null>(null);

  const ship = useShip(selectedShip?.id);

  const getDmg = () => {
    if (!selectedGun || !ship.stats || !ship || !ship.raw) {
      return;
    }

    const jbBonuses = {
      gunDmg: 0.6,
      critRate: 0.3,
      critDmg: 0.5,
    };

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

    const weaponsProps = weaponJson[selectedGun.id + 13];
    const coefficient =
      (weaponsProps.corrected ?? weaponJson[selectedGun.id].corrected ?? 100) /
      100;
    const formationBonus = -0.05;
    const fpSkillBonus = 0;
    const armorModifier = 1;
    const ammoBuff = 0.1;
    const skillBuffs = jbBonuses.gunDmg; // skills that increase damage generally
    const ammoTypeModifier = 0; // skills that affect ammo types
    const enemyDebuff = 0; // skills like helena's radar scan
    const hunterSkill = 0; // hull specific damage bonus
    const manual = false; // did the user manually aim
    const manualModifier = 0; // skills like JB's stuff
    const critical = critRate; // Should be the crit chance for an average damage
    const criticalModifier = jbBonuses.critDmg;
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
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/*{ships.map((ship) => (*/}
        {/*  <div key={ship.id}>{ship.names.en}</div>*/}
        {/*))}*/}
        <div style={{ marginBottom: 20 }}>{selectedShip?.label}</div>
        {/*{Object.entries<Ship>(ship.stats.baseStats).map(([key, value]) => (*/}
        {/*  <div key={key}>*/}
        {/*    {key}: {value}*/}
        {/*  </div>*/}
        {/*))}*/}
        {/*{Object.entries<Ship>(ship.stats.level100).map(([key, value]) => (*/}
        {/*  <div key={key}>*/}
        {/*    {key}: {value}*/}
        {/*  </div>*/}
        {/*))}*/}
        <div style={{ display: "flex" }}>
          <div style={{ display: "grid" }}>
            <div style={{ width: 200 }}>
              <Autocomplete
                renderInput={(params) => (
                  <TextField {...params} label="Ship" fullWidth />
                )}
                options={options}
                onChange={(event, newValue) => {
                  setSelectedShip(newValue);
                }}
                value={selectedShip}
                // getOptionLabel={(option) => option.label}
              />
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={ship.enhanced}
                  onChange={(event, checked) => ship.setEnhanced(checked)}
                />
              }
              label="Max enhancements"
            />

            <ToggleButtonGroup
              value={ship.intimacy}
              exclusive
              onChange={(
                event: React.MouseEvent<HTMLElement>,
                newIntimacy: Intimacy | null
              ) => {
                if (!newIntimacy) {
                  return;
                }

                ship.setIntimacy(newIntimacy);
              }}
            >
              {Object.keys(affinity).map((val) => (
                <ToggleButton value={val} key={val}>
                  {val}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          {ship && ship.stats && (
            <div>
              {Object.entries(ship.stats).map(([stat, value]) => (
                <div key={stat}>
                  {stat}: {value}
                </div>
              ))}
            </div>
          )}
        </div>
        <Slider
          min={1}
          max={125}
          value={ship.level}
          onChange={(event, newLevel) => {
            if (typeof newLevel !== "number") {
              return;
            }

            ship.setLevel(newLevel);
          }}
          valueLabelDisplay="auto"
          marks={marks}
        />
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
        <div>{selectedGun?.id}</div>
        <div>Damage: {gun?.dmg}</div>
        <div>Damage per shot: {gun?.finalDmg}</div>
        <div>DPS: {gun?.finalDps}</div>
        <div>Reload: {gun?.finalReload.toFixed(2)}s</div>
        <div>Crit chance: {((gun?.critRate ?? 0) * 100).toFixed(2)}%</div>
        <div>Chance to hit: {((gun?.accuracy ?? 0) * 100).toFixed(2)}%</div>
      </main>
    </div>
  );
};

export default Home;
