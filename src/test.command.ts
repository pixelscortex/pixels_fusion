import { SlashCommandBuilder } from "discord.js";

const test = () =>
  new SlashCommandBuilder().setName("testxx").setDescription("test");

export default test;
