import React, { useEffect, useMemo, useState } from "react";
import { calculateDamage } from "../styles/utils/formulas";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useShip } from "../hooks/useShip";
import Slider from "@mui/material/Slider";
import {
  equipmentData,
  getEquipment,
  getEquipmentRarity,
} from "../styles/utils/data";
import { defender, getMaxEquipmentLevel } from "../styles/utils/constants";
import { GunIcon } from "./GunIcon";

export const WeaponSelector = ({ equippedById }: { equippedById: number }) => {
  const ship = useShip(equippedById);

  const [selectedGun, setSelectedGun] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [gunRank, setGunRank] = useState(0);
  const [alwaysCrits, setAlwaysCrits] = useState(false);

  const gunOptions = useMemo(() => {
    if (!ship) {
      return [];
    }

    return Object.values(equipmentData)
      .filter(
        (equip) =>
          equip.name &&
          equip.name !== "0" &&
          !["Prologue", "Default gear", "序章用", "默认装备"].includes(
            equip.descrip
          ) &&
          !["460mm"].some((term) => equip.name.includes(term)) &&
          ![14400, 14420, 14440].includes(equip.id) &&
          !/[^\x00-\x7F]/.test(equip.name) &&
          ship.template.equip_1.includes(equip.type)
      )
      .map((equip) => ({
        label: equip.name,
        id: equip.id,
      }))
      .sort((equip1, equip2) => {
        let gun1 = getEquipment(equip1.id, { level: 0, type: "weapon" });
        let gun2 = getEquipment(equip2.id, { level: 0, type: "weapon" });
        if (!gun1 || !gun2) {
          return 0;
        }
        gun1 = getEquipment(equip1.id, {
          level: Math.min(gun1.maxLevel, 10),
          type: "weapon",
        })!;
        gun2 = getEquipment(equip2.id, {
          level: Math.min(gun2.maxLevel, 10),
          type: "weapon",
        })!;

        if (!gun1 || !gun2) {
          return 0;
        }

        const dmg1 = calculateDamage({
          attacker: ship,
          gun: gun1,
          options: {
            ammo: 5,
            isCritical: alwaysCrits,
          },
        }).against(defender);

        const dmg2 = calculateDamage({
          attacker: ship,
          gun: gun2,
          options: {
            ammo: 5,
            isCritical: alwaysCrits,
          },
        }).against(defender);

        return dmg2.dps - dmg1.dps;
      });
  }, [alwaysCrits, ship]);

  const weapon = useMemo(() => {
    if (!selectedGun) {
      return undefined;
    }

    return getEquipment(selectedGun.id, {
      level: gunRank,
      type: "weapon",
    });
  }, [gunRank, selectedGun]);

  useEffect(() => {
    setGunRank(Math.min(weapon?.maxLevel ?? 0, 10));
    // setGunRank(gun?.maxLevel ?? 0);
  }, [weapon?.maxLevel]);

  return (
    <div>
      <div style={{ width: 200 }}>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Main gun" fullWidth />
          )}
          renderOption={(props, option) => {
            const equipment = getEquipment(option.id, { level: 0 });

            if (!equipment) {
              console.warn("No equip found", option.id);
              return null;
            }

            const gun = getEquipment(option.id, {
              level: Math.min(
                10,
                getMaxEquipmentLevel(
                  equipmentData[option.id].rarity,
                  equipmentData[option.id].tech
                ) ?? 0
              ),
              type: "weapon",
            });

            const dmg =
              ship && gun
                ? calculateDamage({
                    attacker: ship,
                    gun,
                    options: {
                      ammo: 5,
                      isCritical: alwaysCrits,
                    },
                  }).against(defender)
                : undefined;

            return (
              <li
                {...props}
                key={option.id}
                style={{
                  background: `url(${getEquipmentRarity(
                    option.id
                  )}) no-repeat center center / cover`,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50px auto",
                    alignItems: "center",
                  }}
                >
                  <GunIcon id={option.id} size={50} noBackground />
                  <div>
                    {option.label}
                    <span style={{ color: "red" }}>
                      {dmg && ` - DPS: ${dmg.dps.toFixed(0)}`}
                    </span>
                  </div>
                </div>
              </li>
            );
          }}
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
      {selectedGun && <GunIcon id={selectedGun.id} size={116} />}

      <FormControlLabel
        control={
          <Checkbox
            checked={alwaysCrits}
            onChange={(event, checked) => setAlwaysCrits(checked)}
          />
        }
        label="Always crits"
      />

      {weapon && (
        <Slider
          min={0}
          max={weapon.maxLevel}
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
            // {
            //   value: 10,
            //   label: "10",
            // },
            {
              value: weapon.maxLevel,
              label: weapon.maxLevel,
            },
          ]}
        />
      )}
    </div>
  );
};
