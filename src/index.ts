// modules
import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import config from './config';
import { Module } from './types';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// constants
const args = yargs(hideBin(process.argv)).option('bot', {
    type: 'string',
    description: 'The set of Discord bot credentials to use',
    default: 'production',
}).argv as { bot: string };

console.log(`running on ${args.bot}`);

// types
type CustomClient = Client & {
    commands: Collection<string, any> | undefined;
};

// create client
const client: CustomClient = new Client({ intents: [] }) as CustomClient;

// onready
client.on('ready', async () => {
    // activate modules
    console.log('== ACTIVATING MODULES ==');

    for (const module of fs.readdirSync(path.join(__dirname, 'modules'))) {
        const data: Module = require(path.join(
            __dirname,
            'modules',
            module
        )).default;

        console.log(`activating ${data.name} module`);
        data.run(client);
    }

    // Process commands
    client.commands = new Collection();
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    console.log('== ACTIVATING COMMANDS ==');
    for (const folder of commandFolders) {
        if (!fs.lstatSync(path.join(foldersPath, folder)).isDirectory()) {
            continue;
        }

        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            console.log('activating ' + folder + '/' + file);
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
            }
        }
    }

    // Handle commands
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands?.get(interaction.commandName);

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    });

    // log ready
    console.log('== READY ==');
    console.log(`${client.user?.username} armed`);
});

// Log in to Discord with your client's token
client.login(config.bots[args.bot].token);
