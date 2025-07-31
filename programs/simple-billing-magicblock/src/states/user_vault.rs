use {
  crate::{common::constant::PRICE_PER_GB_STORAGE, utils::math::bytes_to_gb},
  anchor_lang::prelude::*,
  std::ops::Mul,
};

pub const BILLING_PENDING: u8 = 0;
pub const BILLING_CHARGED: u8 = 1;

#[account]
#[derive(Debug, InitSpace)]
pub struct UserVault {
  pub owner: Pubkey,
  pub usage_bytes: u64,
  pub bump: u8,
  pub rent_lamports: u64,
  pub billing_status: Option<u8>,
}

impl UserVault {
  pub fn init(&mut self, owner: Pubkey, bump: u8, rent_lamports: u64) {
    self.owner = owner;
    self.usage_bytes = 0;
    self.bump = bump;
    self.rent_lamports = rent_lamports;
  }

  pub fn is_in_billing_process(&self) -> bool {
    if self.billing_status.is_none() {
      return false;
    }

    self
      .billing_status
      .is_some_and(|status| status == BILLING_PENDING)
  }

  pub fn calculate_total_price_user_vault(&self) -> Result<f64> {
    let storage_fee = bytes_to_gb(self.usage_bytes).mul(PRICE_PER_GB_STORAGE as f64);

    Ok(storage_fee)
  }
}
