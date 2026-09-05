import { IsNotEmpty, IsString } from 'class-validator';

// Only the description is editable after posting — everything that affects
// the balance (`type`, `amount`, `balanceAfter`) is append-only and can only
// be corrected via a reversing entry.
export class UpdateLedgerEntryDto {
  @IsString()
  @IsNotEmpty()
  description!: string;
}
