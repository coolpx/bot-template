import { Client } from 'discord.js';
import { Module } from '../types';

const data: Module = {
    name: 'example module',
    run: async (client: Client) => {
        console.log(`example module loaded on ${client.user?.username}`);
    },
};

export default data;
