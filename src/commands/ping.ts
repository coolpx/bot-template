import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

const command: Command = {
    data: new SlashCommandBuilder().setName('ping').setDescription('returns pong'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('pong');
    },
};

export default command;
