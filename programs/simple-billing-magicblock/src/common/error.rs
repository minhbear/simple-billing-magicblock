use anchor_lang::prelude::*;

#[error_code]
pub enum Error {
  #[msg("Invalid operator")]
  InvalidOperator,

  #[msg("Wrong user vault")]
  WrongUserVault,

  #[msg("Overflow")]
  Overflow,

  #[msg("User vault is in billing process")]
  UserVaultIsInBillingProcess,

  #[msg("User vault not touch threshold")]
  UserVaultNotTouchThreshold,

  #[msg("User vault already delegated")]
  UserVaultHadDelegated,

  #[msg("User not have enough amount to deposit")]
  UserNotHaveEnoughAmountToDeposit,

  #[msg("User vault not in billing process")]
  UserVaultNotInBillingProcess,

  #[msg("Insufficient funds in user vault for charge fee")]
  InsufficientFundsInUserVaultForChargeFee,
}
