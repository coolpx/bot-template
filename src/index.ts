// modules
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import config from './config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// constants
const args = yargs(hideBin(process.argv)).option('bot', {
    type: 'string',
    description: 'The set of Discord bot credentials to use',
    default: 'production',
}).argv as { bot: string };

console.log(`running on ${args.bot}`);

// variables
const commands: { [name: string]: Command } = {};

// create client
const client = new Client({
    intents: [
        // IMPORTANT: Add bot intents here
        // Example: GatewayIntentBits.GuildMembers
    ],
});

// onready
client.on('ready', async () => {
    // activate modules
    console.log('== ACTIVATING MODULES ==');

    const modulesPath = path.join(__dirname, 'modules');
    for (const entry of fs.readdirSync(modulesPath, { recursive: true })) {
        const moduleFile = typeof entry === 'string' ? entry : entry.toString();
        const fullPath = path.join(modulesPath, moduleFile);
        if (moduleFile.endsWith('.js') && fs.lstatSync(fullPath).isFile()) {
            const data: Module = require(fullPath).default;
            console.log(`activating ${data.name} module`);
            data.run(client);
        }
    }

    // Process commands
    const commandsPath = path.join(__dirname, 'commands');
    console.log('== ACTIVATING COMMANDS ==');
    for (const entry of fs.readdirSync(commandsPath, { recursive: true })) {
        const commandFile = typeof entry === 'string' ? entry : entry.toString();
        const fullPath = path.join(commandsPath, commandFile);
        if (commandFile.endsWith('.js') && fs.lstatSync(fullPath).isFile()) {
            console.log('activating ' + commandFile);
            const command = require(fullPath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                commands[command.data.name] = command;
            } else {
                console.log(
                    `[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`
                );
            }
        }
    }

    // Handle commands
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands[interaction.commandName];

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
