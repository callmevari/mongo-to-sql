import readline from "readline";
import { ParserService } from "./src/parser/parser.service";
import { BuilderService } from "./src/builder/builder.service";
import { GameService } from "./src/game/game.service";

const parserService = new ParserService();
const builderService = new BuilderService();
const gameService = new GameService();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "\n> ",
});

console.log("\n🧠 MongoDB to SQL Translator");
console.log('Enter a MongoDB query to translate, or type "exit" to quit.');
console.log("-----------------------------------------------------");

rl.prompt();

rl.on("line", (input) => {
  const trimmed = input.trim();

  if (trimmed.toLowerCase() === "exit") {
    console.log("\n👋 Goodbye!");
    rl.close();
    process.exit(0);
    return;
  }

  try {
    const parsed = parserService.parseMongoQuery(trimmed);
    const sql = builderService.buildSQLQuery(parsed);
    console.log("\n🟢 SQL Result:\n");
    console.log(sql);
    gameService.trackQuery();
  } catch (error) {
    console.error("\n🔴 Error while processing query:");
    console.error(error instanceof Error ? error.message : error);
  }

  rl.prompt();
});
