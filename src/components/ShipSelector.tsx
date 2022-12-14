import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Ship } from "./Ship";
import { ShipData } from "../types/ship";
import { nationality } from "../utils/constants";
import { ships } from "../utils/data";
import { useFleet } from "../hooks/useFleet";
import { useLoadouts } from "../hooks/useLoadouts";
import { FleetPosition } from "../providers/fleet-context";

const getName = (ship: ShipData) => {
  return `${ship.name} (${nationality[ship.nationality]})`;
};

const options = Object.entries(ships)
  .filter(
    ([id]) =>
      id.endsWith("1") /* || (id[id.length - 3] === "1" && id.endsWith("4"))*/
  )
  .map(([, s]) => ({
    label: getName(s),
    id: s.id,
  }))
  .sort();

export type ShipSelectorProps = {
  position: FleetPosition;
};

export const ShipSelector = ({ position }: ShipSelectorProps) => {
  const [, fleet] = useFleet();
  const [selectedShip, setSelectedShip] = useState<{
    label: string;
    id: number;
  } | null>(null);

  const loadouts = useLoadouts();

  return (
    <div>
      <div style={{ width: 200 }}>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Ship" fullWidth />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            );
          }}
          options={options}
          onChange={(event, newValue) => {
            let loadoutId = null;
            if (newValue) {
              loadoutId = loadouts.create(newValue.id);
            }

            fleet.setShip(
              position,
              newValue ? { id: newValue.id, loadoutId } : null
            );
            setSelectedShip(newValue);
          }}
          value={selectedShip}
        />
      </div>

      {selectedShip?.id && <Ship id={selectedShip.id} />}
    </div>
  );
};
