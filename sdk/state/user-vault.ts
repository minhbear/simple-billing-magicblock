import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Display } from "./display";

interface IUserVault {
  owner: PublicKey;
  usageBytes: BN;
  bump: number;
  rentLamports: BN;
  billingStatus: number | null;
}

export class UserVault implements Display {
  state: IUserVault;

  constructor(data: IUserVault) {
    this.state = data;
  }

  display(): void {
    const { owner, bump, usageBytes, billingStatus, rentLamports } = this.state;

    console.log(
      [
        "User Vault {",
        `  owner                : ${owner.toBase58()}`,
        `  bump                 : ${bump}`,
        `  usageBytes           : ${usageBytes.toString()}`,
        `  billingStatus        : ${billingStatus}`,
        `  rentLamports         : ${rentLamports.toString()}`,
        "}",
      ].join("\n")
    );
  }
}
