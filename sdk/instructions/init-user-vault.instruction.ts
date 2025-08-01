import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getProgram } from "../utils/program";

interface InitUserVaultAccounts {
  owner: PublicKey;
  userVault: PublicKey;
}

interface InitUserVaultParams {}

interface InitUserVaultPayload {
  params: InitUserVaultParams;
  accounts: InitUserVaultAccounts;
}

export const initUserVaultIx = async (
  connection: Connection,
  payload: InitUserVaultPayload
): Promise<TransactionInstruction> => {
  const { accounts } = payload;
  const program = getProgram(connection);

  return await program.methods
    .initUserVault()
    .accountsPartial({
      owner: accounts.owner,
      userVault: accounts.userVault,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};
