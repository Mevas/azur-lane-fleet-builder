import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { AzurAPI } from "@azurapi/azurapi";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import data from "../data/ship_data_statistics.json";
import enhancements from "../data/ship_data_strengthen.json";
import {
  Autocomplete,
  FormControlLabel,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const ships = Object.fromEntries(
  Object.entries(data as any).filter(([, ship]) => ship.is_character === 1)
);

const nationality = {
  0: "Universal",
  1: "Eagle Union",
  2: "Royal Navy",
  3: "Sakura Empire",
  4: "Iron Blood",
  5: "Dragon Empery",
  6: "Sardegna Empire",
  7: "Northern Parliament",
  8: "Iris Libre",
  9: "Vichya Dominion",
  97: "META",
  98: "Universal",
  101: "Neptunia",
  102: "Bilibili",
  103: "Utawarerumono",
  104: "Kizuna AI",
  105: "Hololive",
  106: "Venus Vacation",
  107: "The Idolmaster",
  108: "SSSS",
};

const attributes = {
  durability: ["Health", 0, "Health"],
  cannon: ["Fire", 1, "Firepower", "fp"],
  torpedo: ["Torp", 2, "Torpedo", "trp"],
  antiaircraft: ["AA", 3, "AA"],
  air: ["Air", 4, "Aviation", "avi"],
  reload: ["Reload", 5, "Reload", "rld"],
  armor: ["ArmorDebug", 6, "Armor"],
  hit: ["Acc", 7, "Accuracy"],
  dodge: ["Evade", 8, "Evasion"],
  speed: ["Speed", 9, "Speed"],
  luck: ["Luck", 10, "Luck"],
  antisub: ["ASW", 11, "ASW"],
};

// attr, enhance pos
const attribute_enhance = {
  fp: 0,
  trp: 1,
  avi: 3,
  rld: 4,
};

const getShip = (name: string) => {
  return Object.entries(ships)
    .filter(([, ship]) => ship.english_name === name)
    .map(([, s]) => s);
};

const getGroupId = (id: number) => id.toString().slice(0, -1);

const getShipById = (id: number) => {
  const groupId = getGroupId(id);

  return Object.entries(ships)
    .filter(([, ship]) => ship.id.toString().startsWith(groupId))
    .map(([, s]) => s);
};

const getName = (ship: any) => {
  return `${ship.name} (${nationality[ship.nationality]})`;
};

const Home: NextPage = () => {
  const [level, setLevel] = useState<number>(30);
  const [selectedShip, setSelectedShip] = useState<{
    label: string;
    id: number;
  } | null>(null);
  const [affection, setAffection] = useState<string>("stranger");
  const [maxEnhancements, setMaxEnhancements] = useState<boolean>(true);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAffection: string | null
  ) => {
    setAffection(newAffection);
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setLevel(newValue as number);
  };

  const ship = selectedShip
    ? getShipById(selectedShip.id)[
        level <= 70
          ? 0
          : level > 70 && level <= 80
          ? 1
          : level > 80 && level <= 90
          ? 2
          : 3
      ]
    : undefined;

  const affinityValue = {
    stranger: 1,
    friendly: 1.01,
    crush: 1.03,
    love: 1.06,
    oath: 1.09,
    max: 1.12,
  };

  const getStat = (
    attrs: number[],
    growth: number[],
    stat: string,
    level: number,
    enhance: number = 0,
    affinity: number = 1
  ) => {
    // @ts-ignore
    return (
      (attrs[attributes[stat][1]] +
        // @ts-ignore
        ((level - 1) * growth[attributes[stat][1]]) / 1000 +
        enhance) *
      affinity
    );
  };
  const options = Object.entries(ships)
    .filter(([id]) => id.endsWith("1"))
    .map(([, s]) => ({
      label: getName(s),
      id: s.id,
    }))
    .sort();
  console.log("a", options);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/*{ships.map((ship) => (*/}
        {/*  <div key={ship.id}>{ship.names.en}</div>*/}
        {/*))}*/}
        <div style={{ marginBottom: 20 }}>{selectedShip?.label}</div>
        {/*{Object.entries<Ship>(ship.stats.baseStats).map(([key, value]) => (*/}
        {/*  <div key={key}>*/}
        {/*    {key}: {value}*/}
        {/*  </div>*/}
        {/*))}*/}
        {/*{Object.entries<Ship>(ship.stats.level100).map(([key, value]) => (*/}
        {/*  <div key={key}>*/}
        {/*    {key}: {value}*/}
        {/*  </div>*/}
        {/*))}*/}
        <div style={{ display: "flex" }}>
          <div style={{ display: "grid" }}>
            <div style={{ width: 200 }}>
              <Autocomplete
                renderInput={(params) => (
                  <TextField {...params} label="Ship" fullWidth />
                )}
                options={options}
                onChange={(event: Event, newValue: number | number[]) => {
                  setSelectedShip(newValue);
                }}
                value={selectedShip}
                // getOptionLabel={(option) => option.label}
              />
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={maxEnhancements}
                  onChange={(event, checked) => setMaxEnhancements(checked)}
                />
              }
              label="Max enhancements"
            />

            <ToggleButtonGroup
              value={affection}
              exclusive
              onChange={handleAlignment}
            >
              {Object.keys(affinityValue).map((val) => (
                <ToggleButton value={val} key={val}>
                  {val}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          {ship && (
            <div>
              {Object.entries(attributes).map(([key, values]) => (
                <div>
                  {key}:{" "}
                  {Math.floor(
                    getStat(
                      ship.attrs,
                      ship.attrs_growth,
                      key,
                      level,
                      values[3] !== undefined
                        ? maxEnhancements &&
                            enhancements[getGroupId(selectedShip.id)]
                              .durability[attribute_enhance[values[3]]]
                        : 0,
                      affinityValue[affection]
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Slider
          min={1}
          max={125}
          value={level}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
