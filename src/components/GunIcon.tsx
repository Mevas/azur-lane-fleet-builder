import React from "react";
import Image from "next/image";
import { getEquipmentRarity, getGunIconUrl } from "../utils/data";

export const GunIcon = ({
  size,
  id,
  noBackground,
}: {
  size: number;
  id: number;
  noBackground?: boolean;
}) => {
  return (
    <div style={{ position: "relative", height: size }}>
      {!noBackground && (
        <div style={{ position: "absolute" }}>
          <Image
            src={getEquipmentRarity(id)}
            alt="Gun icon background"
            objectFit="contain"
            width={size}
            height={size}
          />
        </div>
      )}

      <div style={{ position: "absolute" }}>
        <Image
          src={getGunIconUrl(id)}
          alt="Gun icon image"
          objectFit="contain"
          width={size}
          height={size}
          style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
};
