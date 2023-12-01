import { SlashCommandBuilder } from "discord.js";

const queue = () =>
  new SlashCommandBuilder()
    .setDescription("queue")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription(" game that you want to play")
        .setRequired(true)
        .addChoices(
          { name: "League of Legends", value: "leagueoflegends" },
          { name: "Valorant", value: "valorant" },
          { name: "Apex", value: "apex" }
        )
    );

export default queue;
