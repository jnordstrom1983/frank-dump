#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const dump_1 = require("./commands/dump/dump");
const restore_1 = require("./commands/restore/restore");
const program = new commander_1.Command();
program
    .name('charlee-dump')
    .description('CLI to dump and restore data from Charlee spaces')
    .version('0.0.1');
program.command('dump')
    .description('Dumps data from a charlee installation')
    .requiredOption('--host <host>', 'Charlee host')
    .requiredOption('--spaceId <spaceId>', 'Charlee space')
    .requiredOption('--apiKey <apiKey>', 'Space API key')
    .requiredOption('--path <path>', "Path to dump data to")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dump_1.dump)(options.host, options.spaceId, options.apiKey, options.path);
    process.exit();
}));
program.command('restore')
    .description('Restores data from a charlee dump')
    .requiredOption('--host <host>', 'Charlee host')
    .requiredOption('--spaceId <spaceId>', 'Charlee space')
    .requiredOption('--apiKey <apiKey>', 'Space API key')
    .requiredOption('--path <path>', "Path to restore data from")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, restore_1.restore)(options.host, options.spaceId, options.apiKey, options.path);
    process.exit();
}));
program.parse();
//# sourceMappingURL=index.js.map