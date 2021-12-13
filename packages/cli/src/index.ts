import { program } from "commander";
import * as console from "console";
import { join } from "path";

export const run = () => {
  program.command("open").description("Open description").action(console.log);

  program
    .command("run")
    .description("Run description")
    .action(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("ts-node").register();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      global.user = "Alice";
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(join(process.cwd(), "example/hello.ts")).default();
    });

  program.parse(process.argv);
};
