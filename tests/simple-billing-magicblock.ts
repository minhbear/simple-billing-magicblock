import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { isNil } from "lodash";
import { SimpleBillingMagicblock } from "../target/types/simple_billing_magicblock";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { OPERATOR_KEYPAIR, USER1_KEYPAIR, USER2_KEYPAIR } from "./accounts";
import {
  chargeFeeIx,
  commitAndStartBillingIx,
  delegateUserVaultIx,
  depositIx,
  initSystemVaultIx,
  initUserVaultIx,
  seeds,
  SystemVault,
  trackUserActivityIx,
  UserVault,
} from "../sdk";
import { sendSolanaTransaction } from "./utils";
import { assert } from "chai";
import { BN } from "bn.js";
import { GetCommitmentSignature } from "@magicblock-labs/ephemeral-rollups-sdk";

describe("simple-billing-magicblock", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const providerEphemeralRollup = new anchor.AnchorProvider(
    new anchor.web3.Connection(
      process.env.PROVIDER_ENDPOINT || "https://devnet.magicblock.app/",
      {
        wsEndpoint: process.env.WS_ENDPOINT || "wss://devnet.magicblock.app/",
      }
    ),
    anchor.Wallet.local()
  );
  const routerConnection = new anchor.web3.Connection(
    process.env.ROUTER_ENDPOINT || "https://devnet-router.magicblock.app",
    {
      wsEndpoint:
        process.env.ROUTER_WS_ENDPOINT || "wss://devnet-router.magicblock.app",
    }
  );

  console.log("\n========================================");
  console.log("         Loading Configuration");
  console.log("========================================\n");

  const providerWallet = provider.wallet.payer as Keypair;
  const connection = new Connection(provider.connection.rpcEndpoint);
  const ephemeralConnection = new Connection(
    providerEphemeralRollup.connection.rpcEndpoint
  );

  console.log("\n");
  console.log("Base Connection: ", connection.rpcEndpoint);
  console.log("Ephemeral Rollup Connection: ", ephemeralConnection.rpcEndpoint);
  console.log("\n");

  const program = anchor.workspace
    .simpleBillingMagicblock as Program<SimpleBillingMagicblock>;
  const ephemeralProgram = new Program<SimpleBillingMagicblock>(
    program.idl,
    providerEphemeralRollup
  );

  const user1Keypair = Keypair.fromSecretKey(Uint8Array.from(USER1_KEYPAIR));
  const user2Keypair = Keypair.fromSecretKey(Uint8Array.from(USER2_KEYPAIR));
  const operatorKeypair = Keypair.fromSecretKey(
    Uint8Array.from(OPERATOR_KEYPAIR)
  );
  console.log("========================================");
  console.log("           Accounts loaded");
  console.log("========================================");
  console.log(`  Provider Wallet : ${providerWallet.publicKey.toBase58()}`);
  console.log(`  ProgramId       : ${program.programId.toBase58()}`);
  console.log(`  User 1          : ${user1Keypair.publicKey.toBase58()}`);
  console.log(`  User 2          : ${user2Keypair.publicKey.toBase58()}`);
  console.log(`  Operator        : ${operatorKeypair.publicKey.toBase58()}`);
  console.log("========================================\n");

  xdescribe("Setup System Vault", () => {
    it("Success Initialize System Vault", async () => {
      const systemVaultAccount = PublicKey.findProgramAddressSync(
        seeds.systemVault(),
        program.programId
      )[0];

      const alreadyInitialized = await connection.getAccountInfo(
        systemVaultAccount
      );
      if (!isNil(alreadyInitialized)) {
        const parseSystemVault = program.coder.accounts.decode(
          "systemVault",
          alreadyInitialized.data
        );
        const systemVault = new SystemVault(parseSystemVault);
        systemVault.display();
        console.log("System Authority already initialized");
        return;
      } else {
        const tx = new Transaction();
        const ix = await initSystemVaultIx(connection, {
          accounts: {
            operator: operatorKeypair.publicKey,
            systemAuthority: systemVaultAccount,
          },
          params: {},
        });
        tx.add(ix);

        const txHash = await sendSolanaTransaction({
          connection,
          payer: operatorKeypair,
          tx,
        });
        console.log("txHash: ", txHash);
        // txHash:  qtNc97R4oSNjMeTcTa1PV6SNAAnE56jKb3QSuT7nh35XEubkAHc4fVTiNEv71zJQ88iH1K71h3ZgUYqWAZr2vWF
        assert.isString(txHash);

        const systemVaultData = await program.account.systemVault.fetch(
          systemVaultAccount
        );
        const systemVault = new SystemVault(systemVaultData);
        assert.notEqual(systemVaultData, null);
        systemVault.display();
      }
    });
  });

  xdescribe("User vault", () => {
    xit("Success Initialize User1 Vault", async () => {
      const userVaultAccount = PublicKey.findProgramAddressSync(
        seeds.userVault(user1Keypair.publicKey),
        program.programId
      )[0];

      const tx = new Transaction();
      const ix = await initUserVaultIx(connection, {
        accounts: {
          owner: user1Keypair.publicKey,
          userVault: userVaultAccount,
        },
        params: {},
      });
      tx.add(ix);

      const txHash = await sendSolanaTransaction({
        connection,
        payer: user1Keypair,
        tx,
      });
      console.log("txHash: ", txHash);
      assert.isString(txHash);

      const userVaultData = await program.account.userVault.fetch(
        userVaultAccount
      );
      const userVault = new UserVault(userVaultData);
      assert.notEqual(userVaultData, null);
      userVault.display();
      /**
       * txHash:  3kbjMcY5LyTU9sd9J2Xp2wqTvy6F6pVw1kC1n8FTF5Zk798Vh3pTSXPcrGzh6J5ve7hFd1QR1vTnG35h7QRxG41F
         User Vault {
           owner                : AnGfomfHTgz3SF9oksxerGrrGm14F52TzZnF6RHg2mXL
           bump                 : 253
           usageBytes           : 0
           billingStatus        : null
           rentLamports         : 1301520
         }
       */
    });

    it("Success Initialize User2 Vault", async () => {
      // TODO
    });
  });

  xdescribe("Deposit User Vault", () => {
    xit("Success Deposit User1 Vault", async () => {
      const userVaultAccount = PublicKey.findProgramAddressSync(
        seeds.userVault(user1Keypair.publicKey),
        program.programId
      )[0];

      const tx = new Transaction();
      const ix = await depositIx(connection, {
        accounts: {
          payer: user1Keypair.publicKey,
          userVault: userVaultAccount,
        },
        params: {
          amount: new BN(1 * LAMPORTS_PER_SOL),
        },
      });
      tx.add(ix);

      const txHash = await sendSolanaTransaction({
        connection,
        payer: user1Keypair,
        tx,
      });
      console.log("txHash: ", txHash);
      // txHash:  5FSWDb7f4jntM1y4yXwha92XBK1fx6QMau4W3n9CtLb9rgHrw4z67WyMBcbr8YGbyfdopZqGQL1qh7t6KBppDZDU
      assert.isString(txHash);

      const userVaultData = await program.account.userVault.fetch(
        userVaultAccount
      );
      const userVault = new UserVault(userVaultData);
      userVault.display();
    });

    it("Success Deposit User2 Vault", async () => {
      // TODO
    });
  });

  xdescribe("Delegate User Vault", () => {
    xit("Success delegate User 1 vault", async () => {
      const userVaultPubkey = PublicKey.findProgramAddressSync(
        seeds.userVault(user1Keypair.publicKey),
        program.programId
      )[0];

      const userVaultInfo = await connection.getAccountInfo(userVaultPubkey);
      console.log(
        "Current 'Owner' of User Vault: ",
        userVaultInfo.owner.toBase58()
      );

      const tx = new Transaction();
      const ix = await delegateUserVaultIx(connection, {
        accounts: {
          operator: operatorKeypair.publicKey,
          user: user1Keypair.publicKey,
          userVault: userVaultPubkey,
        },
        params: {},
      });
      tx.add(ix);

      const txHash = await sendSolanaTransaction({
        connection,
        payer: operatorKeypair,
        tx,
      });
      console.log("Delegate User Vault txHash: ", txHash);
      assert.isString(txHash);

      const userVaultDelegatedData = await connection.getAccountInfo(
        userVaultPubkey
      );
      console.log(
        "Current 'Owner' of User Vault: ",
        userVaultDelegatedData.owner.toBase58()
      );

      /**
       * Current 'Owner' of User Vault:  6ZK6M6LY5h5V1RHKfHXgii8WiZgeCBQ7uB5DACngm7ht
       * Delegate User Vault txHash:  3P51Q7rPE86g8NpG4AaEGkfmLH3HNankc4u1Sp31i2FE2RYfPqUpNFEuTBGCfzhpBvFa49QWZfzqpgnZuV2Ukjzh
       * Current 'Owner' of User Vault:  DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh
       */
    });

    it("Success delegate User 2 vault", async () => {
      // TODO
    });
  });

  xdescribe("Track User Activity", () => {
    xit("Success track User 1 activity", async () => {
      const bytes = 1_000_000_000;

      const userVaultPubkey = PublicKey.findProgramAddressSync(
        seeds.userVault(user1Keypair.publicKey),
        program.programId
      )[0];

      const tx = new Transaction();
      const ix = await trackUserActivityIx(connection, {
        accounts: {
          operator: operatorKeypair.publicKey,
          user: user1Keypair.publicKey,
          userVault: userVaultPubkey,
        },
        params: {
          bytes: new BN(bytes),
        },
      });
      tx.add(ix);

      const txHash = await sendSolanaTransaction({
        connection: ephemeralConnection,
        payer: operatorKeypair,
        tx: tx,
      });
      console.log("Track User Activity txHash: ", txHash);
      // txHash:  4sfmgEdNjc4wmWp7JsdVsSDDVR2a5WaM1mNvJKSK929T9Se5joQ3XN1yUQ2G7iYzmz1iEkekf8iaVVz8oDf1dJB5

      const userVaultInBaseChainData = await program.account.userVault.fetch(
        userVaultPubkey
      );
      const userVaultInBaseChain = new UserVault(userVaultInBaseChainData);
      console.log("userVault In Base Chain: ");
      userVaultInBaseChain.display();

      const userVaultInERData = await ephemeralProgram.account.userVault.fetch(
        userVaultPubkey
      );
      const userVaultInER = new UserVault(userVaultInERData);
      console.log("userVault In ER: ");
      userVaultInER.display();
    });

    it("Success track User 2 activity", async () => {
      // TODO
    });
  });

  xdescribe("Commit and Start Billing", () => {
    xit("Success commit and start billing user 1 vault", async () => {
      const userVaultPubkey = PublicKey.findProgramAddressSync(
        seeds.userVault(user1Keypair.publicKey),
        program.programId
      )[0];

      const userVaultInBaseChainData = await program.account.userVault.fetch(
        userVaultPubkey
      );
      const userVaultInBaseChain = new UserVault(userVaultInBaseChainData);
      console.log("userVault In Base Chain: ");
      userVaultInBaseChain.display();

      const tx = new Transaction();
      tx.add(
        await commitAndStartBillingIx(connection, {
          accounts: {
            operator: operatorKeypair.publicKey,
            user: user1Keypair.publicKey,
            userVault: userVaultPubkey,
          },
          params: {},
        })
      );

      const txHash = await sendSolanaTransaction({
        connection: ephemeralConnection,
        payer: operatorKeypair,
        tx: tx,
      });
      console.log("Commit and Start Billing txHash In ER: ", txHash);
      // txHash: 2P1VHJr2GPuSUZ44rM7EUsbTdBAcu2eSG2RWy8tSw2gMsT56Riob7JjrJLtVWkDdZwL2C8zKXVoXua891BfCuZif

      // Waiting for commit data from ER to Base chain
      const commitSig = await GetCommitmentSignature(
        txHash,
        ephemeralConnection
      );
      console.log("🚀 ~ commitSig:", commitSig);

      // Waiting for commit data from Base chain had finished
      const commitTx = await connection.getTransaction(commitSig, {
        commitment: "finalized",
      });
      console.log("🚀 ~ commitTx:", commitTx);

      const userVaultInBaseChainDataAfterCommit =
        await program.account.userVault.fetch(userVaultPubkey);
      const userVaultInBaseChainAfterCommit = new UserVault(
        userVaultInBaseChainDataAfterCommit
      );
      console.log("userVault In Base Chain After Commit: ");
      userVaultInBaseChainAfterCommit.display();
    });

    it("Success commit and start billing user 2 vault", async () => {
      // TODO
    });
  });

  xdescribe("Charge Fee", () => {
    it("Success charge fee User 1 Vault", async () => {
      const userVaultPubkey = PublicKey.findProgramAddressSync(
        seeds.userVault(user1Keypair.publicKey),
        program.programId
      )[0];
      const SystemVaultPubkey = PublicKey.findProgramAddressSync(
        seeds.systemVault(),
        program.programId
      )[0];

      const tx = new Transaction();
      tx.add(
        await chargeFeeIx(connection, {
          accounts: {
            operator: operatorKeypair.publicKey,
            user: user1Keypair.publicKey,
            userVault: userVaultPubkey,
            systemVault: SystemVaultPubkey,
          },
          params: {},
        })
      );

      const txHash = await sendSolanaTransaction({
        connection,
        payer: operatorKeypair,
        tx,
      });
      console.log("Charge Fee txHash: ", txHash);
      // txHash: 2KEwUdnWf99moin1rh4bMjTB7ryEutDJCL7XBPShsNDrsWqmoVXxLFCXt1PtwC2S6UgZdALtqvJ7SKEzYY6PqTYX
    });
  });
});
