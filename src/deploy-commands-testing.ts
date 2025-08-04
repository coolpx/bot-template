import { REST, Routes } from 'discord.js';
import config from './config';
import fs from 'node:fs';
import path from 'node:path';

const commands = [];
// Grab all the command files from the commands directory you created earlier
// eslint-disable-next-line no-undef
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    if (!fs.lstatSync(path.join(foldersPath, folder)).isDirectory()) {
        continue;
    }
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file: string) => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        for (const botId of Object.keys(config.bots)) {
            await new REST()
                .setToken(config.bots[botId].token)
                .put(
                    Routes.applicationGuildCommands(
                        config.bots[botId].clientId,
                        config.testingGuildId
                    ),
                    {
                        body: commands
                    }
                );

            console.log(
                `Successfully reloaded application (/) commands of ${botId}.`
            );
        }
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
