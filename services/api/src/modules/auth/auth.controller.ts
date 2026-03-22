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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import {
  RegisterDto,
  LoginDto,
  GoogleAuthDto,
  AppleAuthDto,
  RefreshTokenDto,
  LogoutDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  DeleteAccountDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // AUTH-002
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới', description: 'Tạo tài khoản người dùng với email và password.' })
  @ApiResponse({ status: 201, description: 'Tài khoản đã được tạo thành công.' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  // AUTH-003
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập', description: 'Đăng nhập vào hệ thống bằng email và mật khẩu.' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công, trả về tokens.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password, body.rememberMe);
  }

  // AUTH-004
  @Post('google')
  @ApiOperation({ summary: 'Đăng nhập bằng Google', description: 'Sử dụng idToken từ Google SDK để xác thực.' })
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() body: GoogleAuthDto) {
    return this.authService.googleAuth(body.idToken);
  }

  // AUTH-005
  @Post('apple')
  @ApiOperation({ summary: 'Đăng nhập bằng Apple', description: 'Đăng nhập qua Sign in with Apple.' })
  @HttpCode(HttpStatus.OK)
  async appleAuth(@Body() body: AppleAuthDto) {
    return this.authService.appleAuth(
      body.identityToken,
      body.authorizationCode,
      body.fullName,
      body.email,
    );
  }

  // AUTH-006
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Token', description: 'Lấy Access Token mới bằng Refresh Token hợp lệ.' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  // AUTH-007
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất', description: 'Thu hồi token hiện tại hoặc đăng xuất trên mọi thiết bị.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser('sub') userId: string,
    @Body() body: LogoutDto,
  ) {
    await this.authService.logout(userId, body.refreshToken, body.allDevices);
  }

  // AUTH-008
  @Post('forgot-password')
  @ApiOperation({ summary: 'Quên mật khẩu', description: 'Gửi email chứa link đặt lại mật khẩu.' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body.email);
    return { message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi' };
  }

  // AUTH-009
  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu', description: 'Sử dụng token từ email để thiết lập mật khẩu mới.' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }

  // AUTH-010
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thông tin cá nhân', description: 'Lấy thông tin người dùng hiện tại.' })
  async getMe(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  // G1: Change Password
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu', description: 'Thay đổi mật khẩu cho người dùng đang đăng nhập.' })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() body: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, body.currentPassword, body.newPassword);
    return { message: 'Mật khẩu đã được thay đổi' };
  }

  // G2: Delete Account
  @Delete('account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tài khoản', description: 'Đánh dấu tài khoản để xóa vĩnh viễn.' })
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @CurrentUser('sub') userId: string,
    @Body() body: DeleteAccountDto,
  ) {
    await this.authService.deleteAccount(userId, body.password);
    return { message: 'Tài khoản sẽ bị xóa vĩnh viễn sau 30 ngày' };
  }
}

