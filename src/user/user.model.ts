import prisma from "@/utils/db";
import axios from "axios";

export const userModel = async ({
  servers,
  summonerName,
  uid,
}: {
  servers: string;
  summonerName: string;
  uid: string;
}) => {
  const summoner = await axios<RiotSummonerInfo>({
    method: "get",
    url: `https://${servers.toLowerCase()}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
    headers: {
      "X-Riot-Token": process.env.RIOT_API,
    },
  });

  if (summoner.status === 200) {
    const { id, accountId, puuid } = summoner.data;
    try {
      await prisma.$transaction(async (prisma) => {
        const userExists = await prisma.user.findUnique({
          where: { id: uid },
        });

        try {
          if (!userExists) {
            await prisma.user.create({ data: { id: uid } });
          }
        } catch (error) {
          return { error: true };
        }
        await prisma.user.update({
          where: { id: uid },
          data: {
            riot: {
              id,
              accountId,
              puuid,
              IGN: summonerName,
              server: servers.toLowerCase(),
            },
          },
        });
      });
    } catch (error) {
      return { error: true };
    }

    return { success: true };
  } else {
    return { error: true };
  }
};
