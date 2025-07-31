import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { getProgram } from "../../utils/program";

interface InitSystemVaultAccounts {
  operator: PublicKey;
  systemAuthority: PublicKey;
}

interface InitSystemVaultParams {}

interface InitSystemVaultPayload {
  params: InitSystemVaultParams;
  accounts: InitSystemVaultAccounts;
}

export const initSystemVaultIx = async (
  connection: Connection,
  payload: InitSystemVaultPayload
): Promise<TransactionInstruction> => {
  const accounts = payload.accounts;

  const program = getProgram(connection);

  return await program.methods
    .initSystemVault()
    .accountsPartial({
      operator: accounts.operator,
      systemVault: accounts.systemAuthority,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};
