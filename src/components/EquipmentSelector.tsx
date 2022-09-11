import React, { useEffect, useMemo, useState } from "react";
import {
  Equipment,
  getEquipment,
  getEquipmentRarity,
  processedEquipment,
} from "../utils/data";
import { ShipId, StatName } from "../types/ship";
import Slider from "@mui/material/Slider";
import { Autocomplete, TextField } from "@mui/material";
import { GunIcon } from "./GunIcon";
import { Loadout } from "../types/loadout";
import { useShip } from "../hooks/useShip";
import { useLoadout } from "../hooks/useLoadout";
import { defender, equipmentTypes } from "../utils/constants";
import { calculateDamage } from "../utils/formulas";
import { isWeapon } from "../utils/guards";

export type EquipmentSelectorProps = {
  item: Equipment | null;
  shipId: ShipId;
  loadout: Loadout;
  position: number;
};

const selectorOptions = Object.values(processedEquipment).map(
  (levels) => levels[0]
);

export const EquipmentSelector = ({
  shipId,
  position,
}: EquipmentSelectorProps) => {
  const ship = useShip(shipId);
  const [, { setItem }] = useLoadout();
  const [selectedEquipment, setSelectedEquipment] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [level, setLevel] = useState(0);
  const [loadout] = useLoadout();

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
      }))
      .sort((equip1, equip2) => {
        let e1 = getEquipment(equip1.id, {
          level: Math.min(10, processedEquipment[equip1.id][0].maxLevel),
        });
        let e2 = getEquipment(equip2.id, {
          level: Math.min(10, processedEquipment[equip2.id][0].maxLevel),
        });

        if (!e1 || !e2 || (!loadout.items[0] && position !== 0)) {
          return 0;
        }

        const dmg1 = calculateDamage({
          attacker: ship,
          loadout: {
            ...loadout,
            items: loadout.items.map((item, index) =>
              index === position ? e1! : item
            ),
          },
          options: {
            ammo: 5,
            // isCritical: alwaysCrits,
          },
        }).against(defender);

        const dmg2 = calculateDamage({
          attacker: ship,
          loadout: {
            ...loadout,
            items: loadout.items.map((item, index) =>
              index === position ? e2! : item
            ),
          },
          options: {
            ammo: 5,
            // isCritical: alwaysCrits,
          },
        }).against(defender);

        return dmg2.dps - dmg1.dps;
      });
  }, [loadout, position, ship]);

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

  useEffect(() => {
    setItem(
      position,
      selectedEquipment?.id
        ? processedEquipment[selectedEquipment.id][level]
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, position, selectedEquipment]);

  const damage = useMemo(() => {
    if (!ship || !loadout || !isWeapon(loadout.items[0])) {
      return;
    }

    return calculateDamage({
      attacker: ship,
      loadout,
      options: {
        ammo: 5,
      },
    }).against(defender);
  }, [loadout, ship]);

  return (
    <div>
      <div style={{ display: "grid", gridAutoFlow: "column" }}>
        <div style={{ width: 200 }}>
          <Autocomplete
            renderInput={(params) => (
              <TextField
                {...params}
                label={[
                  ...new Set(
                    (ship.template as any)[`equip_${position + 1}`]
                      .map((typeId: number) => (equipmentTypes as any)[typeId])
                      .filter((equipType: string | undefined) => equipType)
                  ),
                ].join(", ")}
                fullWidth
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => {
              const equipment = getEquipment(option.id, {
                level: Math.min(10, processedEquipment[option.id][0].maxLevel),
              });

              if (!equipment) {
                console.warn("No equip found", option.id);
                return null;
              }

              const dmg =
                ship && equipment && (loadout.items[0] || position === 0)
                  ? calculateDamage({
                      attacker: ship,
                      loadout: {
                        ...loadout,
                        items: loadout.items.map((item, index) =>
                          index === position ? equipment : item
                        ),
                      },
                      options: {
                        ammo: 5,
                        // isCritical: alwaysCrits,
                      },
                    }).against(defender)
                  : undefined;

              const dpsDiff = dmg ? dmg.dps - (damage?.dps ?? 0) : undefined;

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
                      {!!dpsDiff && dpsDiff.toFixed(0) !== "0" && (
                        <span
                          style={{ color: dpsDiff > 0 ? "#006400" : "red" }}
                        >
                          {` - DPS: ${dpsDiff > 0 ? "+" : "-"}${dpsDiff.toFixed(
                            0
                          )}`}
                          {damage && (
                            <>
                              ({dpsDiff > 0 ? "+" : "-"}
                              {((dpsDiff * 100) / damage.dps).toFixed(1)}%)
                            </>
                          )}
                        </span>
                      )}
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

        <div>
          {equipment &&
            [1, 2, 3].map((index) => {
              const attributeName = (equipment.stats as any)[
                `attribute_${index}`
              ] as StatName | undefined;

              if (!attributeName) {
                return;
              }

              return (
                <div key={index}>
                  {attributeName}:{" "}
                  {+(equipment.stats as any)[`value_${index}`] ?? 0}
                </div>
              );
            })}
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
