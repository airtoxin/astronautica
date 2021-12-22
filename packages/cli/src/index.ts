import { program } from "commander";

program
  .command("init")
  .description("Initialize astronautica project")
  .option("-n --name <name>", "Project name")
  .option("-s --server <address>", "Astronautica server address")
  .action(async (options) => {
    console.log("@options", options);
  });

program.parse(process.argv);
