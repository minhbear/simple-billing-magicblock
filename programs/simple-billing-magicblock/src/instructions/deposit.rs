use {
  crate::{
    common::{constant::seeds_prefix, error::Error},
    states::UserVault,
    utils::token_transfer,
  },
  anchor_lang::prelude::*,
};

pub fn process(ctx: Context<Deposit>, amount: u64) -> Result<()> {
  let user_vault = &ctx.accounts.user_vault;

  if user_vault.to_account_info().owner.key() != crate::ID {
    msg!("User vault already delegated");

    return err!(Error::UserVaultHadDelegated);
  }

  if ctx.accounts.payer.lamports() < amount {
    return err!(Error::UserNotHaveEnoughAmountToDeposit);
  }

  token_transfer::deposit_to_vault(
    ctx.accounts.payer.to_account_info(),
    ctx.accounts.user_vault.to_account_info(),
    ctx.accounts.system_program.to_account_info(),
    amount,
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct Deposit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [seeds_prefix::USER_VAULT.as_ref(), user_vault.owner.as_ref()],
    bump
  )]
  pub user_vault: Account<'info, UserVault>,

  pub system_program: Program<'info, System>,
}
