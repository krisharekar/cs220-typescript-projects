import assert from "assert";
import fs from "fs";
import process from "process";
import { parseProgram } from "../include/parser.js";
import { parseExpression } from "../include/parser.js";
import { State, interpExpression, interpStatement, interpProgram } from "./interpreter.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { parse } from "../include/peggyParser.js";

// const argv = process.argv;
// if (argv.length === 3) {
//   const file = argv[2];
//   assert(file.endsWith(".js"), "Only .js files are supported.");
//   if (!fs.existsSync(file)) throw new Error("No such file: " + file);

//   console.log(`Parsing program: ${file}...`);
//   const content = fs.readFileSync(file, "utf-8");
//   const ast = parseProgram(content);
//   console.log(`Parsed program: ${JSON.stringify(ast, undefined, 2)}`);

//   console.log("Interpreting program...");
//   const state = interpProgram(ast);

//   console.log(`Program terminated with state: ${JSON.stringify(state, undefined, 2)}`);
// } else {
//   console.log("Usage:");
//   console.log("   npm run start ./include/programs/<name>.js");
// }

const rl = readline.createInterface({ input, output });

let inp = "";
while (inp !== ".exit") {
  inp = await rl.question("> ");
  if (inp === ".exit") break;

  try {
    const parsed = parseProgram(inp);
    const out = interpProgram(parsed);
    // console.log(`Expected: ${eval(inp)}, Received: ${out}`);
  } catch (err: any) {
    console.error(err.message);
  }
}

rl.close();
