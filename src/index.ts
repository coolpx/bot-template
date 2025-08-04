// modules
import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import credentials from '../credentials';

// constants
const args = yargs(hideBin(process.argv)).option('bot', {
    type: 'string',
    description: 'The set of Discord bot credentials to use',
    default: 'production'
}).argv as { bot: string };

console.log(chalk.blueBright(`Running on ${args.bot}`));

// variables
const commands: { [name: string]: Command } = {};

// create client
const client = new Client({
    intents: [
        // IMPORTANT: Add bot intents here
        // Example: GatewayIntentBits.GuildMembers
    ]
});

// onready
client.on('ready', async () => {
    // activate modules
    console.log(chalk.magentaBright('== ACTIVATING MODULES =='));

    const modulesPath = path.join(__dirname, 'modules');
    for (const entry of fs.readdirSync(modulesPath, { recursive: true })) {
        const moduleFile = typeof entry === 'string' ? entry : entry.toString();
        const fullPath = path.join(modulesPath, moduleFile);
        if (moduleFile.endsWith('.js') && fs.lstatSync(fullPath).isFile()) {
            const data: Module = require(fullPath).default;
            console.log(chalk.greenBright(`Activating ${data.name} module`));
            data.run(client);
        }
    }

    // Process commands
    const commandsPath = path.join(__dirname, 'commands');
    console.log(chalk.magentaBright('== ACTIVATING COMMANDS =='));
    for (const entry of fs.readdirSync(commandsPath, { recursive: true })) {
        const commandFile =
            typeof entry === 'string' ? entry : entry.toString();
        const fullPath = path.join(commandsPath, commandFile);
        if (commandFile.endsWith('.js') && fs.lstatSync(fullPath).isFile()) {
            console.log(chalk.greenBright('Activating ' + commandFile));
            const command = require(fullPath).default as Command;
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                commands[command.data.name] = command;
            } else {
                console.log(
                    chalk.yellowBright(
                        `[WARNING] The command at ${fullPath} is missing a required "data" or "execute" property.`
                    )
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
                chalk.redBright(
                    `No command matching ${interaction.commandName} was found.`
                )
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(chalk.redBright(error));
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }
    });

    // log ready
    console.log(chalk.cyanBright('== READY =='));
    console.log(chalk.cyan(`${client.user?.username} armed`));
});

// Log in to Discord with your client's token
client.login(credentials[args.bot].token).catch((error) => {
    let errorMessage = 'Unknown error';
    if (typeof error === 'object' && 'code' in error) {
        if (error.code === 'TokenInvalid') {
            errorMessage = 'Invalid token provided';
        }
    }

    console.error(
        chalk.redBright(`Bot exited: ${errorMessage}. Full error:`),
        error
    );
});
