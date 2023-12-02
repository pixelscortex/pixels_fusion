import { SlashCommandBuilder } from "discord.js";

const command = () =>
  new SlashCommandBuilder()
    .setDescription("queue")
    .addStringOption((option) =>
      option
        .setName("game_name")
        .setDescription(" game that you want to play")
        .setRequired(true)
        .addChoices(
          { name: "League of Legends", value: "league_of_legends" },
          { name: "Valorant", value: "valorant" }
        )
    );

export default command;
