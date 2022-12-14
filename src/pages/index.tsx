import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import { Button } from "@mui/material";
import { useFormations } from "../hooks/useFormations";
import { Formation } from "../components/Formation";

const Home: NextPage = () => {
  const formations = useFormations();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ paddingBottom: 500 }}>
        {/*{ships.map((ship) => (*/}
        {/*  <div key={ship.id}>{ship.names.en}</div>*/}
        {/*))}*/}
        {/*<div style={{ marginBottom: 20 }}>{selectedShip?.label}</div>*/}
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

        <Button onClick={formations.create}>Create formation</Button>

        {formations.ids.map((id) => (
          <Formation id={id} key={id} />
        ))}
      </main>
    </div>
  );
};

export default Home;
