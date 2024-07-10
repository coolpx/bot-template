export type Module = {
    name: string;
    run: (client: import('discord.js').Client) => void;
};

export type CodeGame = {
    active: boolean;
    creator: string | undefined;
    name: string | undefined;
    code: string | undefined;
    hint: string | undefined | null;
    reward: string | undefined | null;
};
