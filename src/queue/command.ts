import { gameModeChoices } from "@/utils/choices/queue/gameMode.choice";
import { gameNameChoices } from "@/utils/choices/queue/gameName.choice";
import { gameRankChoices } from "@/utils/choices/queue/gameRank.choic";
import { SlashCommandBuilder } from "discord.js";

const queue = () =>
  new SlashCommandBuilder()
    .setDescription("queue")
    .addStringOption((option) =>
      option
        .setName("game_name")
        .setDescription(" game that you want to play")
        .setRequired(true)
        .addChoices(...gameNameChoices)
    )
    .addStringOption((option) =>
      option
        .setName("game_rank")
        .setDescription(" game that you want to play")
        .setRequired(true)
        .addChoices(...gameRankChoices)
    )
    .addStringOption((option) =>
      option
        .setName("game_mode")
        .setDescription(" game that you want to play")
        .setRequired(true)
        .addChoices(...gameModeChoices)
    );

export default queue;
