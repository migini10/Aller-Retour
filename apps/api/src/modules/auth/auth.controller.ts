import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsNotEmpty, Length, IsIn } from 'class-validator';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

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

  @IsString()
  @IsNotEmpty()
  @IsIn(['PASSENGER', 'DRIVER'])
  accountType!: 'PASSENGER' | 'DRIVER';
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

export class RequestVerificationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['EMAIL', 'WHATSAPP'])
  channel!: 'EMAIL' | 'WHATSAPP';
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp!: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un nouveau compte via Mobile' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto.phone, dto.fullName, dto.accountType, dto.pin);
  }

  @Post('login-mobile')
  @ApiOperation({ summary: 'Connexion par numéro de téléphone et PIN Wave/OM' })
  async loginMobile(@Body() dto: LoginDto) {
    return this.authService.loginWithMobile(dto.phone, dto.pin);
  }

  @Post('unblock')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
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

  @Post('request-verification')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Demander un code OTP et un lien de vérification' })
  async requestVerification(@Req() req: any, @Body() dto: RequestVerificationDto) {
    return this.authService.requestVerification(req.user.id, dto.channel);
  }

  @Post('verify-otp')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier le compte via code OTP' })
  async verifyOtp(@Req() req: any, @Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(req.user.id, dto.otp);
  }

  @Get('verify-link/:token')
  @ApiOperation({ summary: 'Vérifier le compte via un lien sécurisé cliquable' })
  async verifyLink(@Param('token') token: string) {
    return this.authService.verifyLink(token);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil utilisateur courant (vérification session)' })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
