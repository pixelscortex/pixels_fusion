import { Guild, GuildMember, Interaction } from "discord.js";

const interaction = (i: Interaction) => {
  if (i.isChatInputCommand()) {
    const member = i.member as GuildMember;
    const guild = i.guild as Guild;
    const options = i.options;
    i.reply(`hey <@${options.get("user")?.value}>`);
  }
};

export default interaction;
