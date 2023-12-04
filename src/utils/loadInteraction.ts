import { Interaction } from "discord.js";
import { glob } from "glob";
import path from "path";

export default async function loadInteractions(): Promise<
  { s: string; f: Function }[]
> {
  const files = await glob(`**/*.interaction.ts`);

  const interactions: { s: string; f: Function }[] = [];

  let totalFilesLoaded = 0;
  let interactionsLoaded = 0;

  for (const file of files) {
    totalFilesLoaded++;
    const filePath = path.resolve(file);
    const interactionName = path.basename(path.dirname(file));
    const interactionExport = require(filePath).default;

    if (typeof interactionExport === "function") {
      const interactionFunction: (interaction: Interaction) => void =
        interactionExport;

      interactions.push({ s: interactionName, f: interactionFunction });

      interactionsLoaded++;
    } else {
      console.warn(
        `Warning: The interaction in ${interactionName} does not export a function. Skipping.`
      );
    }
  }

  console.log(
    `Interactions Loaded ${interactionsLoaded} out of ${totalFilesLoaded}`
  );

  return interactions;
}
