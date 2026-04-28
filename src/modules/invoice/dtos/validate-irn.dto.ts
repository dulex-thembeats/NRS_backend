import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateIrnDto {
  @ApiProperty({
    description: 'The invoice reference number',
    example: 'ITW001',
  })
  @IsString()
  @IsNotEmpty()
  invoice_reference: string;

  @ApiProperty({
    description: 'The business ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  business_id: string;

  @ApiProperty({
    description: 'The Invoice Reference Number (IRN) to validate',
    example: 'IRN123456789',
  })
  @IsString()
  @IsNotEmpty()
  irn: string;
} 