## Running ER MagicBlock Local Validator

### 1. Install ER validator

```bash
npm install -g @magicblock-labs/ephemeral-validator
```

### 2. Start Local Validator

```
ACCOUNTS_REMOTE=https://rpc.magicblock.app/devnet
ACCOUNTS_LIFECYCLE=ephemeral ephemeral-validator
```

### 3. Run the test with Local Validator

```bash
PROVIDER_ENDPOINT=http://localhost:8899 WS_ENDPOINT=ws://localhost:8900 anchor test --skip-build --skip-deploy --skip-local-validator
```

## Deployment Steps

### 1. Security Prerequisites

- Secure wallet private key
- Ensure proper upgrade authority
- Clean up temporary keypair files
- Set appropriate transaction fee limits

### 2. Configure Solana CLI

```bash
solana config set -u {rpc_url} -k {wallet_key}.json
```

### 4. Build and Deploy

```bash
anchor build
```

```bash
# Deploy program
solana program deploy target/deploy/simple_billing_magicblock.so
```
