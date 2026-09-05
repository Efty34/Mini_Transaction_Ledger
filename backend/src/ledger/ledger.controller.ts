import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../users/enums/role.enum';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';
import { UpdateLedgerEntryDto } from './dto/update-ledger-entry.dto';
import { LedgerService } from './ledger.service';

// No DELETE route here, deliberately: posted ledger entries are append-only.
// Mistakes are corrected via POST .../reverse, never by removing a row.
@Controller('accounts/:accountId/entries')
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Body() createLedgerEntryDto: CreateLedgerEntryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    await this.assertAccountAccess(accountId, currentUser);
    const entry = await this.ledgerService.createEntry(
      accountId,
      createLedgerEntryDto,
    );
    return { message: 'Ledger entry created successfully', data: entry };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    await this.assertAccountAccess(accountId, currentUser);
    const entries = await this.ledgerService.findAllForAccount(accountId);
    return { message: 'Ledger entries retrieved successfully', data: entries };
  }

  @Get(':entryId')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Param('entryId', ParseUUIDPipe) entryId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    await this.assertAccountAccess(accountId, currentUser);
    const entry = await this.ledgerService.findOne(accountId, entryId);
    return { message: 'Ledger entry retrieved successfully', data: entry };
  }

  // Only the description may be edited after posting; see UpdateLedgerEntryDto.
  @Patch(':entryId')
  @HttpCode(HttpStatus.OK)
  async updateDescription(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Param('entryId', ParseUUIDPipe) entryId: string,
    @Body() updateLedgerEntryDto: UpdateLedgerEntryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    await this.assertAccountAccess(accountId, currentUser);
    const entry = await this.ledgerService.updateDescription(
      accountId,
      entryId,
      updateLedgerEntryDto.description,
    );
    return { message: 'Ledger entry updated successfully', data: entry };
  }

  @Post(':entryId/reverse')
  @HttpCode(HttpStatus.CREATED)
  async reverse(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Param('entryId', ParseUUIDPipe) entryId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    await this.assertAccountAccess(accountId, currentUser);
    const reversal = await this.ledgerService.reverseEntry(accountId, entryId);
    return { message: 'Ledger entry reversed successfully', data: reversal };
  }

  private async assertAccountAccess(
    accountId: string,
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    const account = await this.accountsService.findOne(accountId);

    if (currentUser.role !== Role.ADMIN && account.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }
  }
}
