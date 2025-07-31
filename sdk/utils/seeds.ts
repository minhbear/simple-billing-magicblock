import { PublicKey } from "@solana/web3.js";

export const seeds = {
  systemVault: () => [Buffer.from("system_vault")],
  userVault: (owner: PublicKey) => [
    Buffer.from("user_vault"),
    owner.toBuffer(),
  ],
};
