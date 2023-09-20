#! /usr/bin/env node
import { Command } from 'commander'
import { dump } from './commands/dump/dump';
import { restore } from './commands/restore/restore';

const program = new Command();

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
  .action(async (options) => {
    await dump(options.host, options.spaceId, options.apiKey, options.path)
    process.exit();

  });


  program.command('restore')
  .description('Restores data from a charlee dump')
  .requiredOption('--host <host>', 'Charlee host')
  .requiredOption('--spaceId <spaceId>', 'Charlee space')
  .requiredOption('--apiKey <apiKey>', 'Space API key')
  .requiredOption('--path <path>', "Path to restore data from")
  .action(async (options) => {
    
    await restore(options.host, options.spaceId, options.apiKey, options.path)
    process.exit();

  });


program.parse();


