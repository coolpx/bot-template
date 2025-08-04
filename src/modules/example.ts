import { Client } from 'discord.js';

const data: Module = {
    name: 'Example',
    run: async (client: Client) => {
        console.log(
            `Hello from the example module! Bot username: ${client.user?.username}`
        );
    }
};

export default data;
