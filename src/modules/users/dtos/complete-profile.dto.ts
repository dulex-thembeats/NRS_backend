import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { DirectorDto } from "./register-user.dto";

export class CompleteProfileDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: "The NRS-issued Entity ID for the business",
    example: "9bb244de-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    required: true,
  })
  entityId: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: "The registered business name",
    example: "NorthGate Technology Limited",
    required: true,
  })
  businessName: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: "The registered business address",
    example: "123 Main St, Lagos, Nigeria",
    required: true,
  })
  businessAddress: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: "The CAC registration certificate number",
    example: "RC123456",
    required: true,
  })
  rcNumber: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: "Date of incorporation (ISO format)",
    example: "2020-01-01",
    required: false,
  })
  dateOfIncorporation?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DirectorDto)
  @ApiProperty({
    description: "List of directors (optional)",
    type: [DirectorDto],
    required: false,
  })
  directors?: DirectorDto[];
}
