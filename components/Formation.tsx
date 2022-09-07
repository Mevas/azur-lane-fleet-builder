import React from "react";
import { Button } from "@mui/material";
import { Fleet } from "./Fleet";
import { useFleets } from "../hooks/useFleets";
import { FormationId } from "../atoms/formations";
import { useFormation } from "../hooks/useFormation";

export type FormationProps = {
  id: FormationId;
};

export const Formation = ({ id }: FormationProps) => {
  const fleets = useFleets();
  const formation = useFormation(id);
  console.log(formation);
  return (
    <div>
      <Button onClick={() => fleets.create(id)}>Create fleet</Button>

      {formation.fleets.surface.map((fleet, index) => (
        <Fleet fleet={fleet} key={index} />
      ))}
    </div>
  );
};
