import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyPinDto {
  @IsString()
  @IsNotEmpty()
  pin!: string;
}

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

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  newPin!: string;
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

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demander un code OTP de réinitialisation de PIN' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendForgotPasswordOtp(dto.phone);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialiser le PIN à l\'aide du code OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordWithOtp(dto.phone, dto.code, dto.newPin);
  }

  @Post('verify-pin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier le code PIN de l\'utilisateur connecté' })
  async verifyPin(@Req() req: any, @Body() dto: VerifyPinDto) {
    return this.authService.verifyUserPin(req.user.id, dto.pin);
  }
}
