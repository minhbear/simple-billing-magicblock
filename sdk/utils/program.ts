import * as anchor from "@coral-xyz/anchor";
import { SimpleBillingMagicblock } from "../../target/types/simple_billing_magicblock";
import simpleBillingMagicblockJson from "../../target/idl/simple_billing_magicblock.json";
import { Connection } from "@solana/web3.js";

export const getProgram = (connection: Connection) => {
  return new anchor.Program<SimpleBillingMagicblock>(
    simpleBillingMagicblockJson,
    {
      connection: new anchor.web3.Connection(connection.rpcEndpoint),
    }
  );
};
