import prisma from "@/utils/db/db";
import { QueueDetails } from "@/utils/types/queue";
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
    return queue;
  } catch (error) {
    console.log(error);
  }
};