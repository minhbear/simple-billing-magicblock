use {anchor_lang::prelude::*, ephemeral_rollups_sdk::anchor::ephemeral};

mod common;
mod instructions;
use instructions::*;
mod states;
mod utils;

declare_id!("6ZK6M6LY5h5V1RHKfHXgii8WiZgeCBQ7uB5DACngm7ht");

#[ephemeral]
#[program]
pub mod simple_billing_magicblock {
  use super::*;

  pub fn init_system_vault(ctx: Context<InitSystemVault>) -> Result<()> {
    admin::init_system_vault::process(ctx)
  }

  pub fn init_user_vault(ctx: Context<InitUserVault>) -> Result<()> {
    init_user_vault::process(ctx)
  }

  pub fn delegate_user_vault(ctx: Context<DelegateUserVault>) -> Result<()> {
    admin::delegate_user_vault::process(ctx)
  }

  pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    deposit::process(ctx, amount)
  }

  pub fn track_user_activity(ctx: Context<TrackUserActivity>, bytes: u64) -> Result<()> {
    admin::track_user_activity::process(ctx, bytes)
  }

  pub fn commit_and_start_billing(ctx: Context<CommitAndStartBilling>) -> Result<()> {
    admin::commit_and_start_billing::process(ctx)
  }

  pub fn charge_fee<'info>(ctx: Context<'_, '_, 'info, 'info, ChargeFee<'info>>) -> Result<()> {
    admin::charge_fee::process(ctx)
  }

}
