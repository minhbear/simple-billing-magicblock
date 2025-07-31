use {
  crate::{
    common::{
      constant::{seeds_prefix, OPERATOR_KEY},
      error::Error,
    },
    states::UserVault,
  },
  anchor_lang::prelude::*,
  ephemeral_rollups_sdk::{anchor::delegate, cpi::DelegateConfig},
};

pub fn process(ctx: Context<DelegateUserVault>) -> Result<()> {
  let user_vault = &ctx.accounts.user_vault;

  if user_vault.is_in_billing_process() {
    return err!(Error::UserVaultIsInBillingProcess);
  }

  ctx.accounts.delegate_user_vault(
    &ctx.accounts.operator,
    &[seeds_prefix::USER_VAULT, ctx.accounts.user.key().as_ref()],
    DelegateConfig::default(),
  )?;

  Ok(())
}

#[delegate]
#[derive(Accounts)]
pub struct DelegateUserVault<'info> {
  #[account(
    mut,
    constraint = operator.key() == OPERATOR_KEY @ Error::InvalidOperator,
  )]
  pub operator: Signer<'info>,

  pub user: SystemAccount<'info>,

  #[account(
    mut,
    del,
    seeds = [seeds_prefix::USER_VAULT, user.key().as_ref()],
    bump = user_vault.bump,
    constraint = user_vault.owner == user.key() @ Error::WrongUserVault,
  )]
  pub user_vault: Account<'info, UserVault>,
}
