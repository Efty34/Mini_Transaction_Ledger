import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { EntryType } from '../enums/entry-type.enum';

export class CreateLedgerEntryDto {
  @IsEnum(EntryType)
  type!: EntryType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
