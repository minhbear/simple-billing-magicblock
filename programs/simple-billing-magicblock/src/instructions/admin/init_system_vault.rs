use {
  crate::{
    common::{
      constant::{seeds_prefix, DISCRIMINATOR, OPERATOR_KEY},
      error::Error,
    },
    states::SystemVault,
  },
  anchor_lang::prelude::*,
};

pub fn process(ctx: Context<InitSystemVault>) -> Result<()> {
  let system_vault = &mut ctx.accounts.system_vault;
  let system_vault_bump = ctx.bumps.system_vault;
  let rent_lamports = system_vault.get_lamports();

  system_vault.init(system_vault_bump, rent_lamports);

  Ok(())
}

#[derive(Accounts)]
pub struct InitSystemVault<'info> {
  #[account(
    mut,
    constraint = operator.key() == OPERATOR_KEY @ Error::InvalidOperator,
  )]
  pub operator: Signer<'info>,

  #[account(
    init,
    payer = operator,
    space = DISCRIMINATOR + SystemVault::INIT_SPACE,
    seeds = [seeds_prefix::SYSTEM_VAULT],
    bump
  )]
  pub system_vault: Account<'info, SystemVault>,

  pub system_program: Program<'info, System>,
}
