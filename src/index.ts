import { Client } from "discord.js";
const client = new Client({ intents: [] });

require("dotenv").config();

client.once("ready", () => {
  console.log("Bot is online!");
});

client.login(process.env.DISCORD_TOKEN); // Replace YOUR_BOT_TOKEN with your Discord bot token
