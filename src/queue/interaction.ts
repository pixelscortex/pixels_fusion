import { CacheType, Guild, GuildMember, Interaction } from "discord.js";
import { queueModel } from "./queue.model";

const interaction = async (i: Interaction<CacheType>) => {
  if (i.isChatInputCommand()) {
    const member = i.member as GuildMember;
    const guild = i.guild as Guild;
    const options = i.options;
    const gameName = options.get("game_name")?.value as string;
    const gameMode = options.get("game_mode")?.value as string;
    const gameRank = options.get("game_rank")?.value as string;
    const user = member.id;
    const queue = await queueModel(
      { gameName, gameMode, gameRank },
      user,
      guild
    );
    if (queue === "in queue") {
      i.reply(` You Are Already In Queue`);
    } else if (queue?.id) {
      i.reply(`Waiting For Players To Join`);
    } else {
      i.reply(`Try Again Later`);
    }
  }
};

export default interaction;
