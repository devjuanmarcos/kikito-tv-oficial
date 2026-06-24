import { Command } from "commander";

import { runAdd } from "./commands/add.js";
import { runDoctor } from "./commands/doctor.js";
import { runInit } from "./commands/init.js";
import { runList } from "./commands/list.js";

const cwd = process.cwd();

const program = new Command()
  .name("kikitocn")
  .description("Install Kikito CN components in your project")
  .version("1.1.0", "-v, --version");

// ── init ─────────────────────────────────────────────────────────────────────
program
  .command("init")
  .description("Set up Kikito CN in your project (tokens, config, peer deps)")
  .action(() => runInit(cwd));

// ── add ───────────────────────────────────────────────────────────────────────
program
  .command("add [components...]")
  .description("Add one or more components to your project")
  .action((components: string[]) => runAdd(components, cwd));

// ── list ──────────────────────────────────────────────────────────────────────
program
  .command("list")
  .description("List all available Kikito CN components")
  .option("-g, --group <group>", "Filter by group (inputs, display, overlay, ...)")
  .action((opts) => runList(cwd, opts));

// ── doctor ────────────────────────────────────────────────────────────────────
program
  .command("doctor")
  .description("Validate your Kikito CN setup")
  .action(() => runDoctor(cwd));

program.parse();
