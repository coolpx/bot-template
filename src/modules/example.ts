import { Client } from 'discord.js';

const data: Module = {
    name: 'example module',
    run: async (client: Client) => {
        console.log(`example module loaded on ${client.user?.username}`);
    },
};

export default data;
