import { useRecoilState } from "recoil";
import { fleetsState } from "../atoms/fleets";

export const useFleet = () => {
  const [fleets, setFleets] = useRecoilState(fleetsState);
  console.log(fleets);
  return { fleets };
};
