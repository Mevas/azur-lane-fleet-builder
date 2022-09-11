import React, { useMemo } from "react";
import { useShip } from "../hooks/useShip";
import {
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Intimacy, ShipId } from "../types/ship";
import { affinity, defender } from "../utils/constants";
import Slider from "@mui/material/Slider";
import Image from "next/image";
import { Loadout } from "./Loadout";
import { calculateDamage } from "../utils/formulas";
import { useRecoilValue } from "recoil";
import { fleetShipSelector } from "../atoms/fleets";
import { Equipment } from "../utils/data";
import { useFleet } from "../hooks/useFleet";
import { LoadoutProvider } from "../providers/loadout-context";

export type ShipProps = {
  id: ShipId;
};

export const Ship = ({ id }: ShipProps) => {
  const [fleet] = useFleet();

  const ship = useShip(id);
  const fleetShip = useRecoilValue(
    fleetShipSelector({ fleetId: fleet.id, shipId: id })
  );

  const weapon = fleetShip?.loadout?.items[0] as Equipment<"weapon"> | null;

  const damage = useMemo(() => {
    if (!weapon || !ship || !fleetShip?.loadout) {
      return;
    }

    return calculateDamage({
      attacker: ship,
      gun: weapon,
      loadout: fleetShip.loadout,
      options: {
        ammo: 5,
      },
    }).against(defender);
  }, [weapon, ship, fleetShip?.loadout]);

  const totalAttributes = useMemo(() => {
    if (!ship?.attributes || !fleetShip?.loadout) {
      return ship?.attributes;
    }

    return Object.fromEntries(
      Object.entries(ship?.attributes).map(([stat, value], index) => [
        stat,
        value + fleetShip.loadout!.bonusAttributes[index],
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fleetShip?.loadout?.bonusAttributes, ship?.attributes]);

  if (!ship || !fleetShip?.loadout) {
    return null;
  }

  return (
    <div>
      <Image
        src={ship.iconUrl}
        alt="Ship icon image"
        height={116}
        width={116}
      />
      <div style={{ display: "flex" }}>
        <div style={{ display: "grid" }}>
          <FormControlLabel
            control={
              <Switch
                checked={ship.enhanced}
                onChange={(event, checked) => ship.set("enhanced", checked)}
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

              ship.set("intimacy", newIntimacy);
            }}
          >
            {Object.keys(affinity).map((val) => (
              <ToggleButton value={val} key={val}>
                {val}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        {totalAttributes && (
          <div>
            {Object.entries(totalAttributes).map(([stat, value]) => (
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

          ship.set("level", newLevel);
        }}
        valueLabelDisplay="auto"
        marks={[
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
        ]}
      />

      <div>{weapon?.stats?.id}</div>
      {damage && (
        <>
          <div>Base damage: {damage.perBullet.base.toFixed(2)}</div>
          <div>Average damage: {damage.perBullet.average.toFixed(2)}</div>
          <div>Shell count: {damage.shells}</div>
          <div>
            Reload: {damage.reload.weapon.toFixed(2)}s (in total{" "}
            {damage.reload.total.toFixed(2)}s)
          </div>
          <div>APS: {(1 / damage.reload.total).toFixed(2)}</div>
          <div>DPS: {damage.dps.toFixed(2)}</div>
          <div>Crit chance: {(damage.criticalChance * 100).toFixed(2)}%</div>
          <div>Crit multi: {(damage.criticalMultiplier * 100).toFixed(2)}%</div>
          <div>Chance to hit: {(damage.accuracy * 100).toFixed(2)}%</div>
          <div>Expected damage by 30s: {(damage.dps * 30).toFixed(0)}</div>
          <div>Expected damage by 120s: {(damage.dps * 120).toFixed(0)}</div>
        </>
      )}

      <LoadoutProvider loadoutId={fleetShip.loadout.id}>
        <Loadout shipId={ship.id} />
      </LoadoutProvider>
    </div>
  );
};
