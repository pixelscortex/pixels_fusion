import { queuedb } from "@/utils/db";
import { CacheType, GuildMember, Interaction } from "discord.js";

const interaction = (i: Interaction<CacheType>) => {
  if (i.isChatInputCommand()) {
    const member = i.member as GuildMember;
    const options = i.options;
    //    i.reply(`Joinned Queue for ${options.get("game")?.value}`);

    const q = queuedb.find((g) => g.gameName === options.get("game")?.value);
    if (q) {
      const p1 = queuedb.findIndex((g) => g.uuid === member.id);
      const p2 = queuedb.findIndex((g) => g.uuid === q.uuid);
      i.reply(
        `Joinned Queue for ${
          options.get("game")?.value
        } \n found a player waiting for you say hi to <@${q.uuid}> `
      );

      queuedb.slice(p1, 1);
      queuedb.slice(p2, 1);
    } else {
      i.reply(`Joinned Queue for ${options.get("game")?.value}`);

      queuedb.push({
        uuid: member.id,
        gameName: options.get("game")?.value as string,
      });
    }

    console.log(queuedb);
  }
};

export default interaction;
