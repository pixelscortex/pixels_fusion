export const GamesGameMode: { [id: string]: GameMode[] } = {};

GamesGameMode["league_of_legends"] = [
  { name: "Draft", value: "draft" },
  { name: "SoloDuo", value: "soloduo" },
  { name: "Flex", value: "flex" },
  { name: "Aram", value: "aram" },
];

GamesGameMode["valorant"] = [
  { name: "Normal", value: "Normal" },
  { name: "Competitive", value: "competitive" },
  { name: "TeamDeathMatch", value: "tdm" },
];
