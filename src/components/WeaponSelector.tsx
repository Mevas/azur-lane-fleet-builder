import React, { useMemo, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useShip } from "../hooks/useShip";
import { processedEquipment } from "../utils/data";

const selectorOptions = Object.values(processedEquipment).map(
  (levels) => levels[0]
);

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

    return selectorOptions
      .filter((equip) => ship.template.equip_1.includes(equip.stats.type))
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
    //       isCritical: alwaysCrits,
    //     },
    //   }).against(defender);
    //
    //   const dmg2 = calculateDamage({
    //     attacker: ship,
    //     gun: gun2,
    //     options: {
    //       ammo: 5,
    //       isCritical: alwaysCrits,
    //     },
    //   }).against(defender);
    //
    //   return dmg2.dps - dmg1.dps;
    // });
  }, [alwaysCrits, ship]);

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={alwaysCrits}
            onChange={(event, checked) => setAlwaysCrits(checked)}
          />
        }
        label="Always crits"
      />
    </div>
  );
};
