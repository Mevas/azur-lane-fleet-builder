import { createContext, useCallback, useMemo } from "react";
import { loadoutSelector } from "../atoms/loadouts";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { Equipment } from "../utils/data";
import { Loadout, LoadoutId } from "../types/loadout";

export type SetItem = (position: number, item: Equipment | null) => void;

type State = {
  loadout: Loadout;
  setLoadout: SetterOrUpdater<Loadout>;
  setItem: SetItem;
};

export const LoadoutContext = createContext<State | undefined>(undefined);

export type LoadoutProviderProps = React.PropsWithChildren<{
  loadoutId: LoadoutId;
}>;

export const LoadoutProvider = ({
  children,
  loadoutId,
}: LoadoutProviderProps) => {
  const [loadout, setLoadout] = useRecoilState(loadoutSelector(loadoutId));

  const setItem = useCallback(
    (position: number, item: Equipment | null) => {
      setLoadout((currVal) => {
        return {
          ...currVal,
          items: currVal.items.map((_item, index) =>
            index === position ? item : _item
          ),
        };
      });
    },
    [setLoadout]
  );
  const value = useMemo(
    () => ({ loadout, setLoadout, setItem }),
    [loadout, setLoadout, setItem]
  );

  return (
    <LoadoutContext.Provider value={value}>{children}</LoadoutContext.Provider>
  );
};
