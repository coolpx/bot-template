import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('returns pong'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('pong');
    }
};