use anchor_lang::prelude::*;

declare_id!("6ZK6M6LY5h5V1RHKfHXgii8WiZgeCBQ7uB5DACngm7ht");

#[program]
pub mod simple_billing_magicblock {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
