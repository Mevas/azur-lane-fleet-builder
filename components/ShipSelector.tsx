import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Ship } from "./Ship";
import { ShipData } from "../types/ship";
import { nationality } from "../styles/utils/constants";
import { ships } from "../styles/utils/data";
import { FleetPosition, SetShip } from "../hooks/useFleet";

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
  setShip: SetShip;
  position: FleetPosition;
};

export const ShipSelector = ({ position, setShip }: ShipSelectorProps) => {
  const [selectedShip, setSelectedShip] = useState<{
    label: string;
    id: number;
  } | null>(null);

  return (
    <div>
      <div style={{ width: 200 }}>
        <Autocomplete
          renderInput={(params) => (
            <TextField {...params} label="Ship" fullWidth />
          )}
          renderOption={(props, option, state) => {
            return (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            );
          }}
          options={options}
          onChange={(event, newValue) => {
            setShip(
              position,
              newValue ? { id: newValue.id, loadout: null } : null
            );
            setSelectedShip(newValue);
          }}
          value={selectedShip}
          // getOptionLabel={(option) => option.label}
        />
      </div>

      {selectedShip?.id && <Ship id={selectedShip.id} />}
    </div>
  );
};
