import React, { useEffect, useMemo, useState } from "react";
import {
  Equipment,
  getEquipment,
  getEquipmentRarity,
  processedEquipment,
} from "../utils/data";
import { ShipId } from "../types/ship";
import { SetItem } from "../hooks/useLoadout";
import Slider from "@mui/material/Slider";
import { Autocomplete, TextField } from "@mui/material";
import { GunIcon } from "./GunIcon";
import { Loadout } from "../types/loadout";
import { useShip } from "../hooks/useShip";

export type EquipmentSelectorProps = {
  item: Equipment | null;
  shipId: ShipId;
  setItem: SetItem;
  loadout: Loadout;
  position: number;
};

const selectorOptions = Object.values(processedEquipment).map(
  (levels) => levels[0]
);

export const EquipmentSelector = ({
  item,
  shipId,
  loadout,
  position,
}: EquipmentSelectorProps) => {
  const ship = useShip(shipId);
  const [selectedEquipment, setSelectedEquipment] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [level, setLevel] = useState(0);

  const equipmentOptions = useMemo(() => {
    if (!ship) {
      return [];
    }

    return selectorOptions
      .filter(
        (equip) =>
          (ship.template as any)[`equip_${position + 1}`].includes(
            equip.stats.type
          ) && !equip.template.ship_type_forbidden.includes(ship.template.type)
      )
      .map((equip) => ({
        label: equip.stats.name,
        id: equip.stats.id,
      }));
    // .sort((equip1, equip2) => {
    //   let gun1 = getEquipment(equip1.id, { level: 0, type: "weapon" });
    //   let gun2 = getEquipment(equip2.id, { level: 0, type: "weapon" });
    //   if (!gun1 || !gun2) {
    //     return 0;
    //   }
    //   gun1 = getEquipment(equip1.id, {
    //     level: Math.min(gun1.maxLevel, 10),
    //     type: "weapon",
    //   })!;
    //   gun2 = getEquipment(equip2.id, {
    //     level: Math.min(gun2.maxLevel, 10),
    //     type: "weapon",
    //   })!;
    //
    //   if (!gun1 || !gun2) {
    //     return 0;
    //   }
    //
    //   const dmg1 = calculateDamage({
    //     attacker: ship,
    //     gun: gun1,
    //     options: {
    //       ammo: 5,
    //       // isCritical: alwaysCrits,
    //     },
    //   }).against(defender);
    //
    //   const dmg2 = calculateDamage({
    //     attacker: ship,
    //     gun: gun2,
    //     options: {
    //       ammo: 5,
    //       // isCritical: alwaysCrits,
    //     },
    //   }).against(defender);
    //
    //   return dmg2.dps - dmg1.dps;
    // });
  }, [position, ship]);

  const equipment = useMemo(() => {
    if (!selectedEquipment?.id) {
      return undefined;
    }

    return getEquipment(selectedEquipment.id, {
      level,
    });
  }, [level, selectedEquipment?.id]);

  useEffect(() => {
    setLevel(Math.min(equipment?.maxLevel ?? 0, 10));
  }, [equipment?.maxLevel]);

  return (
    <div>
      <div style={{ display: "grid", gridAutoFlow: "column" }}>
        <div style={{ width: 200 }}>
          <Autocomplete
            renderInput={(params) => (
              <TextField {...params} label="Main gun" fullWidth />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => {
              const equipment = getEquipment(option.id, { level: 0 });

              if (!equipment) {
                console.warn("No equip found", option.id);
                return null;
              }

              // const gun = getEquipment(option.id, {
              //   level: Math.min(
              //     10,
              //     getMaxEquipmentLevel(
              //       equipmentData[option.id].rarity,
              //       equipmentData[option.id].tech
              //     ) ?? 0
              //   ),
              //   type: "weapon",
              // });
              //
              // const dmg =
              //   ship && gun
              //     ? calculateDamage({
              //         attacker: ship,
              //         gun,
              //         options: {
              //           ammo: 5,
              //           // isCritical: alwaysCrits,
              //         },
              //       }).against(defender)
              //     : undefined;

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
                      {/*<span style={{ color: "red" }}>*/}
                      {/*  {dmg && ` - DPS: ${dmg.dps.toFixed(0)}`}*/}
                      {/*</span>*/}
                    </div>
                  </div>
                </li>
              );
            }}
            options={equipmentOptions}
            onChange={(event, newValue) => {
              setSelectedEquipment(newValue);
            }}
            value={selectedEquipment}
            filterOptions={(options, state) => {
              return options.filter((o) =>
                o.label.toLowerCase().includes(state.inputValue)
              );
            }}
          />
        </div>
        {selectedEquipment && <GunIcon id={selectedEquipment.id} size={116} />}
      </div>

      {equipment && (
        <Slider
          min={0}
          max={equipment.maxLevel}
          value={level}
          onChange={(event, newLevel) => {
            if (typeof newLevel !== "number") {
              return;
            }

            setLevel(newLevel);
          }}
          valueLabelDisplay="auto"
          marks={[
            {
              value: 0,
              label: "0",
            },
            {
              value: equipment.maxLevel,
              label: equipment.maxLevel,
            },
          ]}
        />
      )}
    </div>
  );
};
