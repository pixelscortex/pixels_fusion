type Games = "league_of_legends" | "valorant";
type GameMode = { name: string; value: string };
interface QueueDetails {
  gameName: string;
  gameRank: string;
  gameMode: string;
}

interface RiotSummonerInfo {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}
