import { SlashCommandBuilder } from "discord.js";

const command = () =>
  new SlashCommandBuilder().setDescription("user").addSubcommand((command) =>
    command
      .setName("riot")
      .setDescription("config your user for better experince")
      .addStringOption((option) =>
        option
          .setName("game_name")
          .setDescription(" game that you want to play")
          .setRequired(true)
          .addChoices(
            { name: "League of Legends", value: "league_of_legends" },
            { name: "Valorant", value: "valorant" }
          )
      )
      .addStringOption((option) =>
        option
          .setName("in_game_name")
          .setDescription("your in game name in the selected game")
          .setRequired(true)
      )
  );

export default command;
