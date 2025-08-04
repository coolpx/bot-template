export default {
    // testing guild id
    testingGuildId: '',

    // credentials
    bots: {
        production: {
            token: 'your-bot-token',
            clientId: 'your-client-id',
        },
    } as { [key: string]: { token: string; clientId: string } },
};
