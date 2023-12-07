import riotRanks from "@/utils/choices/lolRanks";
import prisma from "@/utils/db";

import axios from "axios";
import { Guild } from "discord.js";

export const queueModel = async (
  queueDetails: QueueDetails,
  user: string,
  guild: Guild
) => {
  try {
    const { id, name } = guild;
    const { gameMode, gameName } = queueDetails;
    const queue = await prisma.$transaction(async (tx) => {
      let newUserId = user;
      let validateuser = await tx.user.findUnique({
        where: { id: user },
      });
      const validateQueue = validateuser
        ? await tx.queue.findFirst({
            where: { userId: newUserId, fulfilled: false },
          })
        : undefined;
      if (validateQueue) return "in queue";
      if (!validateuser) {
        return "user doesn't exist";
      }
      const validateGuild = await tx.guild.findUnique({
        where: { id: guild.id },
      });
      if (!validateGuild) {
        await tx.guild.create({
          data: { id, name },
        });
      }
      const summoner = await axios({
        method: "get",
        url: `https://${validateuser.riot?.server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${validateuser.riot?.IGN}`,
        headers: {
          "X-Riot-Token": process.env.RIOT_API,
        },
      });
      const ranks = await axios({
        method: "get",
        url: `https://${validateuser.riot?.server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`,
        headers: {
          "X-Riot-Token": process.env.RIOT_API,
        },
      });
      const joinQueue = await tx.queue.create({
        data: {
          gameMode,
          gameRank:
            gameMode === "Flex"
              ? ranks.data[1].tier.toLowerCase()
              : ranks.data[0].tier.toLowerCase(),
          userId: newUserId,
          guildId: guild.id,
          gameName,
        },
      });
      const rankIndex = riotRanks.indexOf(
        gameMode === "Flex"
          ? ranks.data[1].tier.toLowerCase()
          : ranks.data[0].tier.toLowerCase()
      );
      const upperRank =
        rankIndex === 9 ? riotRanks[rankIndex + 1] : riotRanks[rankIndex];
      const lowerRank =
        rankIndex === 0 ? riotRanks[rankIndex - 1] : riotRanks[rankIndex];
      const queues = await tx.queue.findMany({
        where: {
          gameMode,
          gameRank: { in: [upperRank, lowerRank, riotRanks[rankIndex]] },
        },
      });
      console.log(queues);
      return joinQueue;
    });

    return queue;
  } catch (error) {
    console.log(error);
  }
};
