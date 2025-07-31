use {
  crate::{
    common::{
      constant::{seeds_prefix, OPERATOR_KEY, THRESHOLD_PRICE_LAMPORTS},
      error::Error,
    },
    states::{UserVault, BILLING_PENDING},
  },
  anchor_lang::prelude::*,
};

pub fn process(ctx: Context<TrackUserActivity>, bytes: u64) -> Result<()> {
  let user_vault = &mut ctx.accounts.user_vault;

  if user_vault.billing_status.is_some() {
    return err!(Error::UserVaultIsInBillingProcess);
  }

  user_vault.usage_bytes = user_vault
    .usage_bytes
    .checked_add(bytes)
    .ok_or(Error::Overflow)?;

  let total_price_debt = user_vault.calculate_total_price_user_vault()?;
  if total_price_debt >= THRESHOLD_PRICE_LAMPORTS as f64 {
    user_vault.billing_status = Some(BILLING_PENDING);
  }

  Ok(())
}

#[derive(Accounts)]
pub struct TrackUserActivity<'info> {
  #[account(
    mut,
    constraint = operator.key() == OPERATOR_KEY @ Error::InvalidOperator,
  )]
  pub operator: Signer<'info>,

  pub user: SystemAccount<'info>,

  #[account(
    mut,
    seeds = [seeds_prefix::USER_VAULT, user.key().as_ref()],
    bump,
  )]
  pub user_vault: Account<'info, UserVault>,
}
