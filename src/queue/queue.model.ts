import prisma from "@/utils/db/db";
import { QueueDetails } from "@/utils/types/queue";

export const queueModel = async (queueDetails: QueueDetails, user: string) => {
  try {
    const { gameMode, gameName, gameRank } = queueDetails;
    const queue = await prisma.$transaction(async (prisma) => {
      let newUser = user;
      const validateuser = await prisma.user.findUnique({
        where: { id: user },
      });
      const validateQueue = validateuser
        ? await prisma.queue.findFirst({
            where: { userId: newUser },
          })
        : undefined;
      if (validateQueue) return "in queue";
      if (!validateuser) {
        newUser = (await prisma.user.create({ data: { id: user } })).id;
      }
      const joinQueue = await prisma.queue.create({
        data: { gameMode, gameName, gameRank, userId: newUser },
      });
      return joinQueue;
    });
    return queue;
  } catch (error) {
    console.log(error);
  }
};
