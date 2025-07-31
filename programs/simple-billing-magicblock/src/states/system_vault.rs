use anchor_lang::prelude::*;

#[account]
#[derive(Debug, InitSpace)]
pub struct SystemVault {
  pub bump: u8,
  pub rent_lamports: u64,
}

impl SystemVault {
  pub fn init(&mut self, bump: u8, rent_lamports: u64) {
    self.bump = bump;
    self.rent_lamports = rent_lamports;
  }
}
