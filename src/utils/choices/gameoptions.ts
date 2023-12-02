export const GamesGameMode: {
  [id: string]: { gameName: string; modes: GameMode[] };
} = {};

GamesGameMode["league_of_legends"] = {
  gameName: "League of Legends",
  modes: [
    { name: "Draft", value: "draft" },
    { name: "SoloDuo", value: "soloduo" },
    { name: "Flex", value: "flex" },
    { name: "Aram", value: "aram" },
  ],
};

GamesGameMode["valorant"] = {
  gameName: "Valorant",
  modes: [
    { name: "Normal", value: "Normal" },
    { name: "Competitive", value: "competitive" },
    { name: "TeamDeathMatch", value: "tdm" },
  ],
};
