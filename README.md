# discord.js Bot Template

Jumpstart your Discord bot development with this feature-rich TypeScript template, designed to provide a solid, scalable, and developer-friendly foundation for your next project.

## Features

-   **TypeScript First**: Enjoy the benefits of strong typing for a smoother, more reliable development process.
-   **Automatic Command Loading**: Simply drop new command files into the `src/commands` directory, and they're ready to go—no manual registration required.
-   **Modular Architecture**: Organize non-command logic into modules for features like custom statuses or scheduled tasks.
-   **Multi-Environment Support**: Easily switch between production, development, or any other bot configuration using a simple command-line flag.

## Getting Started

### 1. Installation

Install the dependencies using pnpm:

```bash
pnpm install
```

### 2. Configuration

Copy `credentials.example.js` to `credentials.js` and add your bot's token and client ID. You can define multiple bot configurations and switch between them.

```javascript
// credentials.js
export default {
    production: {
        token: 'your-bot-token',
        clientId: 'your-client-id'
    },
    development: {
        token: 'your-dev-bot-token',
        clientId: 'your-dev-client-id'
    }
};
```

### 3. Build the Code

Compile the TypeScript source code:

```bash
pnpm build
```

### 4. Run the Bot

Start your bot using the `start` script.

```bash
pnpm start
```

> **Note**
> To use a bot configuration other than `production`, specify it with the `--bot` flag. For example, to use the `development` bot from the configuration example above, run:
> `pnpm start -- --bot development`

## Development Workflow

### Creating Commands

Creating new slash commands is straightforward:

1.  Look at `src/commands/ping.ts` as a reference.
2.  Duplicate the file or create a new one in the `src/commands` directory (subdirectories are supported).
3.  The bot will automatically load your new command on startup.

To make your commands available on Discord, you need to deploy them:

-   **For Testing:** Deploy commands to a specific guild for instant updates. Set your `testingGuildId` in `src/config.ts` first.

    ```bash
    pnpm deploy-commands-testing
    ```

    > If you later deploy globally, you can remove the testing commands to avoid duplicates:
    > `pnpm delete-testing-commands`

-   **For Production:** Deploy commands globally. It may take up to an hour for Discord to show them, though you can use them immediately by refreshing your client.
    ```bash
    pnpm deploy-commands-global
    ```

### Creating Modules

Modules are perfect for non-command functionality, like setting a custom status or running periodic tasks. Add your module files to the `src/modules` directory, and the bot will load them automatically.

## Continuous Deployment

This template includes a sample GitHub Actions workflow for automated deployments. To set it up:

1.  Rename the `.github_example` directory to `.github`.
2.  Review and customize the `deploy.sh` script to fit your server environment.
3.  In your GitHub repository settings, add the following secrets: `SSH_PRIVATE_KEY`, `SSH_HOST`, and `SSH_USER`.
4.  Manually add your `credentials.js` file to the server.

The workflow will then automatically connect to your server via SSH and run `deploy.sh` on every push to the `main` branch.
