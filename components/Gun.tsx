import React, { useEffect, useMemo, useState } from "react";
import { calculateDamage } from "../styles/utils/formulas";
import { Autocomplete, TextField } from "@mui/material";
import { useShip } from "../hooks/useShip";
import Slider from "@mui/material/Slider";
import Image from "next/image";
import {
  equipmentData,
  getBgUrl,
  getEquipment,
  getEquipmentRarity,
  getGunIconUrl,
} from "../styles/utils/data";

export const Gun = ({ equippedById }: { equippedById: number }) => {
  const ship = useShip(equippedById);

  const gunOptions = useMemo(() => {
    if (!ship) {
      return [];
    }

    return Object.values(equipmentData)
      .filter((equip) => equip.name && !/[^\x00-\x7F]/.test(equip.name))
      .filter((equip) => ship.template.equip_1.includes(equip.type))
      .map((equip) => ({
        label: equip.name,
        id: equip.id,
      }))
      .sort();
  }, [ship]);

  const [selectedGun, setSelectedGun] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [gunRank, setGunRank] = useState(0);

  const gun = useMemo(() => {
    if (!selectedGun) {
      return undefined;
    }

    return getEquipment(selectedGun.id, {
      level: gunRank,
      type: "weapon",
    });
  }, [gunRank, selectedGun]);

  useEffect(() => {
    // setGunRank(Math.min(gun?.maxLevel ?? 0, 10));
    setGunRank(gun?.maxLevel ?? 0);
  }, [gun?.maxLevel]);

  const damage = useMemo(() => {
    if (!gun || !ship) {
      return;
    }

    return calculateDamage({
      attacker: ship,
      gun,
      options: {
        ammo: 5,
        // isCritical: true,
      },
    }).against({
      zone: {
        safe: false,
        maxDanger: 10,
      },
      defender: {
        level: ship.level,
        attributes: {
          dodge: 69,
          luck: 45,
        },
      },
    });
  }, [gun, ship]);

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

            return (
              <li
                {...props}
                key={option.id}
                style={{
                  backgroundImage: `url(${getBgUrl(
                    equipment.stats.rarity - 1
                  )})`,
                }}
              >
                {option.label} - DPS: {}
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
      {selectedGun && (
        <div style={{ position: "relative", height: 116 }}>
          <div style={{ position: "absolute" }}>
            <Image
              src={getEquipmentRarity(selectedGun.id)}
              alt="Gun icon background"
              objectFit="contain"
              width={116}
              height={116}
            />
          </div>
          <div style={{ position: "absolute" }}>
            <Image
              src={getGunIconUrl(selectedGun.id)}
              alt="Gun icon image"
              objectFit="contain"
              width={116}
              height={116}
              style={{ position: "absolute" }}
            />
          </div>
        </div>
      )}
      {gun && (
        <Slider
          min={0}
          max={gun.maxLevel}
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
              value: gun.maxLevel,
              label: gun.maxLevel,
            },
          ]}
        />
      )}
      <div>{selectedGun?.id}</div>
      {damage && (
        <>
          <div>Base damage: {damage.perBullet.base.toFixed(2)}</div>
          <div>Average damage: {damage.perBullet.average.toFixed(2)}</div>
          <div>DPS: {damage.dps.toFixed(2)}</div>
          <div>Reload: {damage.reload.toFixed(2)}s</div>
          <div>Crit chance: {(damage.criticalChance * 100).toFixed(2)}%</div>
          <div>Crit multi: {(damage.criticalMultiplier * 100).toFixed(2)}%</div>
          <div>Chance to hit: {(damage.accuracy * 100).toFixed(2)}%</div>
        </>
      )}
    </div>
  );
};
