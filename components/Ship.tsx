import React from "react";
import { useShip } from "../hooks/useShip";
import {
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Intimacy } from "../types/ship";
import { affinity } from "../styles/utils/constants";
import Slider from "@mui/material/Slider";
import { Gun } from "./Gun";
import Image from "next/image";

export type ShipProps = {
  id: number;
};

export const Ship = ({ id }: ShipProps) => {
  const ship = useShip(id);

  if (!ship) {
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

        {ship && ship.attributes && (
          <div>
            {Object.entries(ship.attributes).map(([stat, value]) => (
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

      <Gun equippedById={ship.id} />
    </div>
  );
};
