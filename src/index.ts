import { config } from "dotenv";
import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import loadCommands from "@/utils/loadCommands";
import loadInteractions from "./utils/loadInteraction";
import prisma from "./utils/db";

config();

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

  client.once("ready", async () => {
    console.log("Bot is online!");
  });

  const interactions = await loadInteractions();
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    // Here, you would determine which interaction handler to use. This is a simplified example.
    for (const handleInteraction of interactions) {
      if (interaction.commandName === handleInteraction.s) {
        try {
          await handleInteraction.f(interaction);
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  const commands = await loadCommands();

  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands.map((c) => c.toJSON()),
    });
    // await rest.put(Routes.applicationCommands(CLIENT_ID), {
    //   body: commands.map((c) => c.toJSON()),
    // });
    client.login(TOKEN);
  } catch (error) {
    console.log(error);
  }
}

main();
