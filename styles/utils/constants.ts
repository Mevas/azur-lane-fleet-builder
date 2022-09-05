import { ModifiableStat, Stat } from "../../types/ship";

export const nationality = {
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

export const affinity = {
  stranger: 1,
  friendly: 1.01,
  crush: 1.03,
  love: 1.06,
  oath: 1.09,
  max: 1.12,
};

export const attributes: Record<
  Stat,
  [
    shorthand: string,
    position: number,
    title: string,
    attributeName?: ModifiableStat
  ]
> = {
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

export const attributePosition: Record<ModifiableStat, number> = {
  fp: 0,
  trp: 1,
  avi: 3,
  rld: 4,
};

export const TICKS_PER_SECOND = 150;

export const ShipType = {
  1: ["Destroyer", "Destroyers", "DD", "DD"],
  2: ["Light Cruiser", "Light cruisers", "CL", "CL"],
  3: ["Heavy Cruiser", "Heavy cruisers", "CA", "CA"],
  4: ["Battlecruiser", "Battlecruisers", "BC", "BC"],
  5: ["Battleship", "Battleships", "BB", "BB"],
  6: ["Light Aircraft Carrier", "Light aircraft carriers", "CVL", "CVL"],
  7: ["Aircraft Carrier", "Aircraft carriers", "CV", "CV"],
  8: ["Submarine", "Submarines", "SS", "SS"],
  9: ["Aviation Cruiser", "Aviation cruisers", "CAV", "CAV"],
  10: ["Aviation Battleship", "Aviation battleships", "BBV", "BBV"],
  11: ["Torpedo Cruiser", "Torpedo cruisers", "CT", "CT"],
  12: ["Repair Ship", "Repair ships", "AR", "AR"],
  13: ["Monitor", "Monitors", "BM", "BM"],
  17: ["Submarine Carrier", "Submarine carriers", "SSV", "SSV"],
  18: ["Large Cruiser", "Large cruisers", "CB", "CB"],
  19: ["Munition Ship", "Munition ships", "AE", "AE"],
  20: ["DDG", "Guided-missile destroyers", "DDG", "DDG"],
  21: ["DDG", "Guided-missile destroyers", "DDG", "DDG"],
};
