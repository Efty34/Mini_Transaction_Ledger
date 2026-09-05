import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { decimalTransformer } from '../../common/transformers/decimal.transformer';
import { EntryType } from '../enums/entry-type.enum';

// Ledger entries are append-only: once posted, `type`, `amount`,
// `balanceAfter` and `accountId` are never modified. Mistakes are corrected
// by posting a reversing entry (see `reversalOfId`/`isReversed`), never by
// editing or deleting a posted row — that would silently invalidate every
// `balanceAfter` snapshot recorded after it and destroy the audit trail.
@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'account_id' })
  accountId!: string;

  @ManyToOne(() => Account, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @Column({ type: 'enum', enum: EntryType })
  type!: EntryType;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    transformer: decimalTransformer,
  })
  amount!: number;

  @Column({
    name: 'balance_after',
    type: 'numeric',
    precision: 15,
    scale: 2,
    transformer: decimalTransformer,
  })
  balanceAfter!: number;

  @Column({ type: 'varchar', nullable: true })
  description!: string | null;

  @Column({ name: 'reversal_of_id', nullable: true })
  reversalOfId!: string | null;

  @ManyToOne(() => LedgerEntry, { nullable: true })
  @JoinColumn({ name: 'reversal_of_id' })
  reversalOf!: LedgerEntry | null;

  @Column({ name: 'is_reversed', default: false })
  isReversed!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
