import {
  Body,
  Controller,
  Delete,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-request.interface';
import { Role } from '../users/enums/role.enum';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    const account = await this.accountsService.create(
      currentUser.id,
      createAccountDto,
    );
    return { message: 'Account created successfully', data: account };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    const accounts =
      currentUser.role === Role.ADMIN
        ? await this.accountsService.findAll()
        : await this.accountsService.findAllForUser(currentUser.id);

    return { message: 'Accounts retrieved successfully', data: accounts };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    const account = await this.accountsService.findOne(id);
    this.assertOwnerOrAdmin(account, currentUser);
    return { message: 'Account retrieved successfully', data: account };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    const account = await this.accountsService.findOne(id);
    this.assertOwnerOrAdmin(account, currentUser);

    const updated = await this.accountsService.update(id, updateAccountDto);
    return { message: 'Account updated successfully', data: updated };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    const account = await this.accountsService.findOne(id);
    this.assertOwnerOrAdmin(account, currentUser);

    await this.accountsService.remove(id);
    return { message: 'Account deleted successfully' };
  }

  private assertOwnerOrAdmin(
    account: Account,
    currentUser: AuthenticatedUser,
  ): void {
    if (currentUser.role !== Role.ADMIN && account.userId !== currentUser.id) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }
  }
}
