import {
  CacheType,
  Colors,
  Guild,
  GuildMember,
  ButtonStyle,
  Interaction,
} from "discord.js";

import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "@discordjs/builders";
import delay from "@/utils/delay";
import { GamesGameMode } from "@/utils/choices/gameoptions";
import { userModel } from "./user.model";

const interaction = async (i: Interaction<CacheType>) => {
  if (i.isChatInputCommand()) {
    if (i.options.getSubcommand() === "riot") {
      const member = i.member as GuildMember;
      const gameNameValue = i.options.get("game_name")?.value as Games;
      const inGameNameValue = i.options.get("in_game_name")?.value as string;
      const gameServer = i.options.get("game_server")?.value as string;
      const embed = new EmbedBuilder()
        .setTitle("Confirm")
        .setDescription(
          `Your IGN ${inGameNameValue} in Game ${GamesGameMode[gameNameValue].gameName}`
        )
        .setColor(Colors.Grey);

      let buttons: ButtonBuilder[] = [];

      buttons.push(
        new ButtonBuilder()
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setStyle(ButtonStyle.Primary)
      );
      buttons.push(
        new ButtonBuilder()
          .setCustomId("Cancel")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Danger)
      );
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
      embed.setTitle("User Config");
      if (gameModeSelectionInteraction.customId === "confirm") {
        const result = await userModel({
          servers: gameServer,
          summonerName: inGameNameValue,
          uid: member.id,
        });

        if (result.error) {
          embed.setDescription("Error").setColor(Colors.Red);
          await reply.edit({
            content: `failed to update your user please try again`,
            embeds: [embed],
            components: [],
          });
        } else {
          embed.setDescription("Success").setColor(Colors.Green);
          await reply.edit({
            content: `user config update successfully`,
            embeds: [embed],
            components: [],
          });
        }
      } else {
        embed.setDescription("Aborted").setColor(Colors.Red);
        await reply.edit({ embeds: [embed], components: [] });
      }
      await delay(3000);
      await reply.delete();
    }
  }
};

export default interaction;
