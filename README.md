# discord.js Bot Template

## Continous Deployment

`.github/workflows/deploy.yml` automatically connects to the production server configured in repository secrets via SSH and runs `deploy.sh`. If your target server is set up for this, configure the secrets `SSH_PRIVATE_KEY`, `SSH_HOST`, and `SSH_USER` in your repository settings. You should absolutely read `deploy.sh` to make sure it works the way you want it to, and modify it if not.

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

```bash
pnpm start
```
