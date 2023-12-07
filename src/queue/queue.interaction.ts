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
import { GamesGameMode } from "../utils/choices/gameoptions";

const interaction = async (i: Interaction<CacheType>) => {
  if (i.isChatInputCommand()) {
    const gameName = i.options.get("game_name")?.value as Games;

    const embed = new EmbedBuilder()
      .setTitle("Select Game Mode")
      .setDescription("Choose the competitive gamemode that best suits.")
      .setColor(Colors.Blue)
      .setTimestamp(new Date());

    let choices = GamesGameMode[gameName];
    let buttons: ButtonBuilder[] = [];

    buttons = choices.modes.map(({ name, value }) => {
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
        time: 10_000,
      })
      .catch(async (error) => {
        embed.setDescription("Timeout");
        await reply.edit({ embeds: [embed], components: [] });
      });

    if (!gameModeSelectionInteraction) return;

    const gameModeResult: any = choices.modes.find(
      (c) => c.value === gameModeSelectionInteraction.customId
    );
    const user = i.user.id;
    const guild: any = i.guild;
    console.log(gameModeResult.name);
    if (!gameModeResult.value) {
      await gameModeSelectionInteraction.reply({
        content: `error`,
        ephemeral: true,
      });
    } else {
      const queue = await queueModel(
        { gameMode: gameModeResult.name, gameName },
        user,
        guild
      );
      if (queue === "in queue") {
        await gameModeSelectionInteraction.reply({
          content: `You Have Already Joined Queue`,
          ephemeral: true,
        });
      }
      if (queue === "user doesn't exist") {
        await gameModeSelectionInteraction.reply({
          content: `You Should First Register With Your In Game Name Use "/user riot"`,
          ephemeral: true,
        });
      }
    }
    await gameModeSelectionInteraction.reply({
      content: `Joined Queue for ${gameModeResult.name} in ${GamesGameMode[gameName].gameName}`,
      ephemeral: true,
    });
  }
};

export default interaction;
