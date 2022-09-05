import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Ship } from "./Ship";
import { ShipData } from "../types/ship";
import { nationality } from "../styles/utils/constants";
import { ships } from "../styles/utils/data";

const getName = (ship: ShipData) => {
  return `${ship.name} (${nationality[ship.nationality]})`;
};

const options = Object.entries(ships)
  .filter(([id]) => id.endsWith("1"))
  .map(([, s]) => ({
    label: getName(s),
    id: s.id,
  }))
  .sort();

export const ShipCard = () => {
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
          options={options}
          onChange={(event, newValue) => {
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
