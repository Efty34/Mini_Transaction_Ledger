import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { LedgerModule } from './ledger/ledger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // load from .env filen
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '',
      port: 5432,
      username: '',
      password: '',
      database: '',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    LedgerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
