import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'currency must be a 3-letter uppercase currency code (e.g. USD)',
  })
  currency!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
