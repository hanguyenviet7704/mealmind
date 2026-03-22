import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Tên người dùng' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'nguyenvana@example.com', description: 'Địa chỉ email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (ít nhất 6 ký tự)' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'nguyenvana@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ required: false, description: 'Giữ trạng thái đăng nhập lâu hơn' })
  @IsOptional()
  rememberMe?: boolean;
}

export class GoogleAuthDto {
  @ApiProperty({ description: 'ID Token nhận từ Google OAuth' })
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}

export class AppleAuthDto {
  @ApiProperty({ description: 'Identity Token từ Apple' })
  @IsString()
  @IsNotEmpty()
  identityToken!: string;

  @ApiProperty({ description: 'Authorization Code từ Apple' })
  @IsString()
  @IsNotEmpty()
  authorizationCode!: string;

  @ApiProperty({ required: false, description: 'Họ tên từ Apple (chỉ trả về lần đầu)' })
  @IsOptional()
  fullName?: { givenName?: string; familyName?: string };

  @ApiProperty({ required: false, description: 'Email từ Apple (chỉ trả về lần đầu)' })
  @IsOptional()
  @IsString()
  email?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token để lấy access token mới' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class LogoutDto {
  @ApiProperty({ required: false, description: 'Refresh token hiện tại' })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({ required: false, description: 'Tick nếu muốn đăng xuất khỏi tất cả các thiết bị' })
  @IsOptional()
  allDevices?: boolean;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'nguyenvana@example.com', description: 'Email để nhận link reset password' })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token đặt lại mật khẩu nhận được qua email' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'newpassword123', description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({ example: 'newpassword123', description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class DeleteAccountDto {
  @ApiProperty({ example: 'password123', description: 'Nhập mật khẩu để xác nhận xóa' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
