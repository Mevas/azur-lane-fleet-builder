import { useCallback, useRef } from "react";
import { v4 as uuid } from "uuid";

export const useUuid = () => {
  const id = useRef(uuid());

  const regenerate = useCallback(() => (id.current = uuid()), []);

  return [id, regenerate] as const;
};
