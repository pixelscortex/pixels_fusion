type Games = "league_of_legends" | "valorant";
type GameMode = { name: string; value: string };
interface QueueDetails {
  gameName: string;
  gameRank: string;
  gameMode: string;
}
