import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // AUTH-002
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.authService.register(body.name, body.email, body.password);
  }

  // AUTH-003
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email: string; password: string; rememberMe?: boolean },
  ) {
    return this.authService.login(body.email, body.password, body.rememberMe);
  }

  // AUTH-004
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() body: { idToken: string }) {
    return this.authService.googleAuth(body.idToken);
  }

  // AUTH-005
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async appleAuth(
    @Body()
    body: {
      identityToken: string;
      authorizationCode: string;
      fullName?: { givenName?: string; familyName?: string };
      email?: string;
    },
  ) {
    return this.authService.appleAuth(
      body.identityToken,
      body.authorizationCode,
      body.fullName,
      body.email,
    );
  }

  // AUTH-006
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  // AUTH-007
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser('sub') userId: string,
    @Body() body: { refreshToken?: string; allDevices?: boolean },
  ) {
    await this.authService.logout(userId, body.refreshToken, body.allDevices);
  }

  // AUTH-008
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body.email);
    return { message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi' };
  }

  // AUTH-009
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }

  // AUTH-010
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  // G1: Change Password
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    await this.authService.changePassword(userId, body.currentPassword, body.newPassword);
    return { message: 'Mật khẩu đã được thay đổi' };
  }

  // G2: Delete Account
  @Delete('account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @CurrentUser('sub') userId: string,
    @Body() body: { password: string },
  ) {
    await this.authService.deleteAccount(userId, body.password);
    return { message: 'Tài khoản sẽ bị xóa vĩnh viễn sau 30 ngày' };
  }
}

