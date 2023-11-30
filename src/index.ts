import { config } from "dotenv";
import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { loaderCommands } from "./utils/loaders";
config();

let lastmessage: string = "";
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

async function main() {
  if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    throw new Error("");
  }

  const client = new Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
  });

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  client.once("ready", () => {
    console.log("Bot is online!");
  });

  //commands
  const commands = await loaderCommands();

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands.map((c) => c.toJSON()),
    });

    client.login(TOKEN);

    client.on("messageCreate", (message) => {
      const messageFormate = `${message.member} sent message ${message.content} in ${message.channel}`;
      lastmessage = messageFormate;
      console.log(messageFormate);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
