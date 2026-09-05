import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

const FOREIGN_KEY_VIOLATION_CODES = new Set(['23503', '23001']);

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  create(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountsRepository.create({
      ...createAccountDto,
      userId,
    });

    return this.accountsRepository.save(account);
  }

  findAllForUser(userId: string): Promise<Account[]> {
    return this.accountsRepository.find({ where: { userId } });
  }

  findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(id);
    Object.assign(account, updateAccountDto);
    return this.accountsRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);

    try {
      await this.accountsRepository.remove(account);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        FOREIGN_KEY_VIOLATION_CODES.has(
          (error as QueryFailedError & { code?: string }).code ?? '',
        )
      ) {
        throw new ConflictException(
          'This account has ledger entries and cannot be deleted. ' +
            'Ledger history is permanent by design.',
        );
      }

      throw error;
    }
  }
}
