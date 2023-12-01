import {
  CacheType,
  Colors,
  Guild,
  GuildMember,
  ButtonStyle,
  Interaction,
} from "discord.js";
import { queueModel } from "./queue.model";
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import { GamesGameMode } from "./gameoptions";

const interaction = async (i: Interaction<CacheType>) => {
  if (i.isChatInputCommand()) {
    const gameName = i.options.get("game_name")?.name;
    const gameNameValue = i.options.get("game_name")?.value as Games;

    const embed = new EmbedBuilder()
      .setTitle("Select Game Mode")
      .setDescription("Choose the competitive gamemode that best suits.")
      .setColor(Colors.Blue)
      .setTimestamp(new Date());

    let choices = GamesGameMode[gameNameValue];
    let buttons: ButtonBuilder[] = [];
    console.log(gameNameValue);

    buttons = choices.map(({ name, value }) => {
      return new ButtonBuilder()
        .setCustomId(value)
        .setLabel(name)
        .setStyle(ButtonStyle.Primary);
    });

    const row = new ActionRowBuilder().addComponents(buttons);

    const reply = await i.reply({
      content: `Select Gamemode`,
      embeds: [embed],
      ephemeral: true,
      //@ts-ignore
      components: [row],
    });

    const gameModeSelectionInteraction = await reply
      .awaitMessageComponent({
        time: 30_000,
      })
      .catch(async (i) => {
        await i.reply({
          content: `Command Timeout`,
          ephemeral: true,
        });
      });

    if (!gameModeSelectionInteraction) return;

    const gameModeResult = choices.find(
      (c) => c.value === gameModeSelectionInteraction.customId
    );

    await gameModeSelectionInteraction.reply({
      content: `Joined Queue for ${gameModeResult} for ${gameName}`,
      ephemeral: true,
    });
  }
};

export default interaction;
