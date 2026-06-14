import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  pin!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @Length(6, 6)
  pin!: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un nouveau voyageur via Mobile' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerPassenger(dto.phone, dto.fullName, dto.pin);
  }

  @Post('login-mobile')
  @ApiOperation({ summary: 'Connexion par numéro de téléphone et PIN Wave/OM' })
  async loginMobile(@Body() dto: LoginDto) {
    return this.authService.loginWithMobile(dto.phone, dto.pin);
  }

  @Post('unblock')
  @ApiOperation({ summary: 'Débloquer un compte utilisateur (Service Client)' })
  async unblock(@Body() dto: { phone: string }) {
    return this.authService.unblockUser(dto.phone);
  }
}
