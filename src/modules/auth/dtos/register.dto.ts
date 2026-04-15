// src/modules/auth/dto/register.dto.ts
import { CreateUserDto } from '../../users/dtos/create-user.dto';

// We can reuse the CreateUserDto since registration has the same fields
export class RegisterDto extends CreateUserDto {}