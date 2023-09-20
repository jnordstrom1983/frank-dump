# frank-dump
frank-dump is an easy to use backup / restore cli for Frank installations.

## Installation
To install frank-dump simply run `npm install -g frank-dump`

## Backup a frank installation
frank-dump will backup all content types, all folders and all content from a frank installation by running:

`frank-dump dump --host <HOST> --spaceId <SPACEID> --apiKey <APIKEY> --path ./backup`

## Restore a frank backup
Restoring a frank-dump backup will create all content types, folders and content found in the backup folder. No data will be overwritten.

`frank-dump restore --host <HOST> --spaceId <SPACEID> --apiKey <APIKEY> --path ./backup`


## Get an apiKey
If you do not already have an apiKey you can generate one from `Settings > API Keys`. Please make sure to choose the `Admin / Developer` role.

