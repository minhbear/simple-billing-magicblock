use anchor_lang::prelude::*;

use crate::{
  common::{
    constant::{seeds_prefix, OPERATOR_KEY},
    error::Error,
  },
  states::{SystemVault, UserVault, BILLING_CHARGED},
};

pub fn process(ctx: Context<ChargeFee>) -> Result<()> {
  let user_vault = &mut ctx.accounts.user_vault;
  if !user_vault.is_in_billing_process() {
    return err!(Error::UserVaultNotInBillingProcess);
  }

  let remaining_lamports = user_vault.get_lamports() - user_vault.rent_lamports;
  let total_fee_debt = user_vault.calculate_total_price_user_vault()?;
  if total_fee_debt > remaining_lamports as f64 {
    msg!(
      "User vault not have enough for charge fee, remaining_lamports: {}, total_fee_debt: {}",
      remaining_lamports,
      total_fee_debt
    );
    return err!(Error::InsufficientFundsInUserVaultForChargeFee);
  }

  let total_fee_debt = total_fee_debt as u64;

  user_vault.sub_lamports(total_fee_debt)?;
  ctx.accounts.system_vault.add_lamports(total_fee_debt)?;

  user_vault.billing_status = Some(BILLING_CHARGED);
  user_vault.usage_bytes = 0;

  Ok(())
}

#[derive(Accounts)]
pub struct ChargeFee<'info> {
  #[account(
    mut,
    constraint = operator.key() == OPERATOR_KEY @ Error::InvalidOperator,
  )]
  pub operator: Signer<'info>,

  pub user: SystemAccount<'info>,

  #[account(
    mut,
    seeds = [seeds_prefix::USER_VAULT, user.key().as_ref()],
    bump
  )]
  pub user_vault: Account<'info, UserVault>,

  #[account(
    mut,
    seeds = [seeds_prefix::SYSTEM_VAULT],
    bump
  )]
  pub system_vault: Account<'info, SystemVault>,
}
