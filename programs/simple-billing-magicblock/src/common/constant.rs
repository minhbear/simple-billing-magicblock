use anchor_lang::{prelude::Pubkey, pubkey, solana_program::native_token::LAMPORTS_PER_SOL};

pub const DISCRIMINATOR: usize = 8;

pub const OPERATOR_KEY: Pubkey = pubkey!("C34it6F5VCbAj5cXXpvNqJ2iQcHFPgfACvrmL9FQUDWd");

pub mod seeds_prefix {
  pub const USER_VAULT: &[u8] = b"user_vault";
  pub const SYSTEM_VAULT: &[u8] = b"system_vault";
}

pub const THRESHOLD_PRICE_LAMPORTS: u64 = 100_000_000; // 0.1 SOL
pub const PRICE_PER_GB_STORAGE: u64 = LAMPORTS_PER_SOL;
