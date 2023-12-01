import { SlashCommandBuilder } from "@discordjs/builders";

const hey = () =>
  new SlashCommandBuilder()
    .setDescription("hey")
    .addUserOption((option) =>
      option.setName("user").setDescription("mention user").setRequired(true)
    );

export default hey;
