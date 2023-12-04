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
    const { gameMode, gameName, gameRank } = queueDetails;
    const queue = await prisma.$transaction(async (prisma) => {
      let newUser = user;
      const validateuser = await prisma.user.findUnique({
        where: { id: user },
      });
      const validateQueue = validateuser
        ? await prisma.queue.findFirst({
            where: { userId: newUser, fulfilled: false },
          })
        : undefined;
      if (validateQueue) return "in queue";
      if (!validateuser) {
        newUser = (await prisma.user.create({ data: { id: user } })).id;
      }
      const validateGuild = await prisma.guild.findUnique({
        where: { id: guild.id },
      });
      if (!validateGuild) {
        await prisma.guild.create({
          data: { id, name },
        });
      }
      const joinQueue = await prisma.queue.create({
        data: {
          gameMode,
          gameName,
          gameRank,
          userId: newUser,
          guildId: guild.id,
        },
      });
      return joinQueue;
    });
    const summoner = await axios({
      method: "get",
      url: "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/mawlaanaa",
      headers: {
        "X-Riot-Token": "RGAPI-81cbe41a-5d9b-463c-8a64-2ea95365013a",
      },
    });
    const ranks = await axios({
      method: "get",
      url: `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`,
      headers: {
        "X-Riot-Token": "RGAPI-81cbe41a-5d9b-463c-8a64-2ea95365013a",
      },
    });

    return queue;
  } catch (error) {
    console.log(error);
  }
};
