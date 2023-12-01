import { SlashCommandBuilder } from "discord.js";
import { glob } from "glob";
import path from "path";

export default async function loadCommands(): Promise<SlashCommandBuilder[]> {
  const files = await glob(`**/command.ts`);

  const commands: SlashCommandBuilder[] = [];

  let totalFilesLoaded = 0;
  let commandsLoaded = 0;

  files.map((file) => {
    totalFilesLoaded++;
    const filePath = path.resolve(file);
    const commandName = path.basename(path.dirname(file));
    const command = require(filePath).default;
    if (
      typeof command === "function" &&
      command() instanceof SlashCommandBuilder
    ) {
      const ref = command() as SlashCommandBuilder;

      try {
        ref.setName(commandName);
        ref.toJSON();
        commands.push(ref);

        commandsLoaded++;
      } catch (error) {
        console.warn(
          `Warning: The command in ${file} does not have name or description make, Sure SlashCommandBuilder has setDescription(). Skipping.`
        );
      }
    } else {
      console.warn(
        `Warning: The command in ${file} does not export an instance of SlashCommandBuilder. Skipping.`
      );
    }
  });
  console.log(`Commands Loaded ${commandsLoaded} out of ${totalFilesLoaded}`);

  return commands;
}
