import { program } from "commander";
import { fetch } from "undici";
import { createTRPCClient } from "@trpc/client";
import { AppRouter } from "@astronautica/server/dist/routes";
import inquirer from "inquirer";
import dedent from "ts-dedent";

program
  .command("init")
  .description("Initialize astronautica project")
  .option("-n --name <name>", "Project name")
  .option("-s --server <address>", "Astronautica server address")
  .action(async (options) => {
    const projectName: string =
      options.name ??
      (
        await inquirer.prompt([
          { type: "input", name: "name", message: "What's project name?" },
        ])
      ).name;
    const serverAddress: string =
      options.server ??
      (
        await inquirer.prompt([
          {
            type: "input",
            name: "serverAddress",
            message: "Where's astronautica server address?",
          },
        ])
      ).serverAddress;
    const client = createTRPCClient<AppRouter>({
      url: serverAddress,
      fetch: fetch as any,
    });
    const apiKey = await client.mutation("project.init", {
      projectName,
    });
    console.log(dedent`
      Project created.
      API Key: ${apiKey.id}
    `);
  });

program.parse(process.argv);
