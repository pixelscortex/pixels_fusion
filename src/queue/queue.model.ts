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
    const queue = await prisma.$transaction(async (prisma) => {
      let newUserId = user;
      let validateuser = await prisma.user.findUnique({
        where: { id: user },
      });
      const validateQueue = validateuser
        ? await prisma.queue.findFirst({
            where: { userId: newUserId, fulfilled: false },
          })
        : undefined;
      if (validateQueue) return "in queue";
      if (!validateuser) {
        return "user doesn't exist";
      }
      const validateGuild = await prisma.guild.findUnique({
        where: { id: guild.id },
      });
      if (!validateGuild) {
        await prisma.guild.create({
          data: { id, name },
        });
      }
      const summoner = await axios({
        method: "get",
        url: `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${validateuser.riot?.IGN}`,
        headers: {
          "X-Riot-Token": process.env.RIOT_API,
        },
      });
      const ranks = await axios({
        method: "get",
        url: `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`,
        headers: {
          "X-Riot-Token": process.env.RIOT_API,
        },
      });
      const joinQueue = await prisma.queue.create({
        data: {
          gameMode,
          gameRank:
            gameMode === "Flex" ? ranks.data[1].tier : ranks.data[0].tier,
          userId: newUserId,
          guildId: guild.id,
          gameName,
        },
      });
      return joinQueue;
    });

    return queue;
  } catch (error) {
    console.log(error);
  }
};
