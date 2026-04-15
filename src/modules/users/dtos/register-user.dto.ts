import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DirectorDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'First name of the director',
    example: 'John',
    required: true,
  })
  firstName: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'Last name of the director',
    example: 'Doe',
    required: true,
  })
  lastName: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email address of the director',
    example: 'john.doe@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @MinLength(10)
  @ApiProperty({
    description: 'Phone number of the director',
    example: '+2348012345678',
    required: true,
  })
  phoneNumber: string;

  @IsString()
  @MinLength(11)
  @ApiProperty({
    description: 'National Identification Number of the director',
    example: '12345678901',
    required: true,
  })
  nin: string;
}

export class RegisterUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The entity ID of the Business',
    example: '1234567890',
    required: true,
  })
  entityId: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    required: true,
  })
  password: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The name of the Business',
    example: 'Byteflow Technology Limited',
    required: true,
  })
  businessName: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'The address of the Business',
    example: '123 Main St, Anytown, USA',
    required: true,
  })
  businessAddress: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: 'The RC number of the Business',
    example: 'RC123456',
    required: true,
  })
  rcNumber: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN', 'PARTNER'])
  @ApiProperty({
    description: 'The role of the user',
    example: 'USER',
    required: false,
    default: 'USER',
  })
  role?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date of incorporation of the business',
    example: '2020-01-01',
    required: false,
  })
  dateOfIncorporation?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectorDto)
  @ApiProperty({
    description: 'Array of directors for the business',
    type: [DirectorDto],
    required: true,
  })
  directors: DirectorDto[];
}