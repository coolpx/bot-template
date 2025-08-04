import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

declare global {
    type Command = {
        data: Optional<SlashCommandBuilder>;
        execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    };

    type Module = {
        name: string;
        run: (client: import('discord.js').Client) => void;
    };

    type CodeGame = {
        active: boolean;
        creator: string | undefined;
        name: string | undefined;
        code: string | undefined;
        hint: string | undefined | null;
        reward: string | undefined | null;
    };
}
