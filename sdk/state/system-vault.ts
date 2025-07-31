import BN from "bn.js";
import { Display } from "./display";

interface ISystemVault {
  bump: number;
  rentLamports: BN;
}

export class SystemVault implements Display {
  private state: ISystemVault;

  constructor(data: ISystemVault) {
    this.state = data;
  }

  display(): void {
    console.log(
      [
        "System Vault {",
        `  bump        : ${this.state.bump}`,
        `  rentLamports: ${this.state.rentLamports.toString()}`,
        "}",
      ].join("\n")
    );
  }
}
