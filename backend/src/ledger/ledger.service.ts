import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { EntryType } from './enums/entry-type.enum';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private readonly ledgerRepository: Repository<LedgerEntry>,
    private readonly dataSource: DataSource,
  ) {}

  async createEntry(
    accountId: string,
    dto: CreateLedgerEntryDto,
  ): Promise<LedgerEntry> {
    return this.dataSource.transaction(async (manager) => {
      // Lock the account row for the duration of the transaction so
      // concurrent entries on the same account can't read a stale balance
      // and both compute the same "next" balanceAfter.
      const account = await manager.findOne(Account, {
        where: { id: accountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new NotFoundException(`Account with id ${accountId} not found`);
      }

      const balanceAfter = this.applyEntry(
        account.balance,
        dto.type,
        dto.amount,
      );

      const entry = manager.create(LedgerEntry, {
        accountId,
        type: dto.type,
        amount: dto.amount,
        balanceAfter,
        description: dto.description ?? null,
      });

      account.balance = balanceAfter;

      await manager.save(account);
      return manager.save(entry);
    });
  }

  findAllForAccount(accountId: string): Promise<LedgerEntry[]> {
    return this.ledgerRepository.find({
      where: { accountId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(accountId: string, id: string): Promise<LedgerEntry> {
    const entry = await this.ledgerRepository.findOne({
      where: { id, accountId },
    });

    if (!entry) {
      throw new NotFoundException(`Ledger entry with id ${id} not found`);
    }

    return entry;
  }

  async updateDescription(
    accountId: string,
    id: string,
    description: string,
  ): Promise<LedgerEntry> {
    const entry = await this.findOne(accountId, id);
    entry.description = description;
    return this.ledgerRepository.save(entry);
  }

  // Corrects a posted entry by posting a new entry with the opposite type
  // and the same amount, rather than editing or deleting the original —
  // the original stays in the table forever, only flagged `isReversed`, so
  // the ledger always reflects exactly what happened, mistake included.
  async reverseEntry(accountId: string, entryId: string): Promise<LedgerEntry> {
    return this.dataSource.transaction(async (manager) => {
      const account = await manager.findOne(Account, {
        where: { id: accountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new NotFoundException(`Account with id ${accountId} not found`);
      }

      const original = await manager.findOne(LedgerEntry, {
        where: { id: entryId, accountId },
      });

      if (!original) {
        throw new NotFoundException(
          `Ledger entry with id ${entryId} not found`,
        );
      }

      if (original.isReversed) {
        throw new BadRequestException(
          'This ledger entry has already been reversed',
        );
      }

      const oppositeType =
        original.type === EntryType.CREDIT ? EntryType.DEBIT : EntryType.CREDIT;

      const balanceAfter = this.applyEntry(
        account.balance,
        oppositeType,
        original.amount,
      );

      const reversal = manager.create(LedgerEntry, {
        accountId,
        type: oppositeType,
        amount: original.amount,
        balanceAfter,
        description: `Reversal of entry ${original.id}`,
        reversalOfId: original.id,
      });

      original.isReversed = true;
      account.balance = balanceAfter;

      await manager.save(account);
      await manager.save(original);
      return manager.save(reversal);
    });
  }

  private applyEntry(
    currentBalance: number,
    type: EntryType,
    amount: number,
  ): number {
    return type === EntryType.CREDIT
      ? currentBalance + amount
      : currentBalance - amount;
  }
}
