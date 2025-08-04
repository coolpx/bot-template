import { REST } from 'discord.js';
import config from '../src/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import credentials from '../credentials';

const args = yargs(hideBin(process.argv)).option('bot', {
    type: 'string',
    description: 'The set of Discord bot credentials to use',
    default: 'production'
}).argv as { bot: string };

const token = credentials[args.bot].token;
const clientId = credentials[args.bot].clientId;
const guildId = config.testingGuildId;

const rest = new REST({ version: '10' }).setToken(token);

async function deleteAllCommands() {
    try {
        const commands = (await rest.get(
            `/applications/${clientId}/guilds/${guildId}/commands`
        )) as any[];
        if (commands.length === 0) {
            console.log('No commands to delete.');
            return;
        }
        for (const command of commands) {
            await rest.delete(
                `/applications/${clientId}/guilds/${guildId}/commands/${command.id}`
            );
            console.log(`Deleted command: ${command.name}`);
        }
        console.log('All testing guild commands deleted.');
    } catch (error) {
        console.error('Error deleting commands:', error);
    }
}

deleteAllCommands();
