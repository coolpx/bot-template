# discord.js Bot Template

## Features

-   **TypeScript**: Strongly typed code for better development experience.
-   **Automatic command loading**: Commands are automatically loaded from the `src/commands` directory.
-   **Modules**: Write modules to add non-command features to your bot, such as a custom status or an hourly task.
-   **Multiple environments**: Switch between development and production environments with a command-line argument.

## Usage

### Install dependencies

```bash
pnpm install
```

### Set the bot token and client ID in src/config.ts

```typescript
production: {
    token: 'your-bot-token',
    clientId: 'your-client-id',
},
```

### Build

```bash
pnpm build
```

### Run

> Note: To use a bot other than `production`, specify `--bot bot-credentials-key`

```bash
pnpm start
```

## Continous Deployment

`.github_example/workflows/deploy.yml` automatically connects to the production server configured in repository secrets via SSH and runs `deploy.sh`. If your target server is set up for this, configure the secrets `SSH_PRIVATE_KEY`, `SSH_HOST`, and `SSH_USER` in your repository settings and rename `.github_example` to `.github`. You should absolutely read `deploy.sh` to make sure it works the way you want it to, and modify it if not.
