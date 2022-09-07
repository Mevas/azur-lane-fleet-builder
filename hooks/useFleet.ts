import { useRecoilValue } from "recoil";
import { FleetId, fleetSelector } from "../atoms/fleets";

export const useFleet = (id: FleetId) => {
  return useRecoilValue(fleetSelector(id));
};
