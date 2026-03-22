import { HttpException, HttpStatus } from '@nestjs/common';

interface AppExceptionOptions {
  errorCode: string;
  message: string;
  statusCode?: HttpStatus;
  details?: Record<string, unknown>;
}

export class AppException extends HttpException {
  constructor(options: AppExceptionOptions) {
    const status = options.statusCode || HttpStatus.BAD_REQUEST;
    super(
      {
        errorCode: options.errorCode,
        message: options.message,
        details: options.details || {},
      },
      status,
    );
  }
}

// ---- Auth Errors ----
export class InvalidCredentialsException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_INVALID_CREDENTIALS',
      message: 'Email hoặc mật khẩu không đúng',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class TokenExpiredException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_TOKEN_EXPIRED',
      message: 'Phiên đăng nhập đã hết hạn',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class TokenInvalidException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_TOKEN_INVALID',
      message: 'Token không hợp lệ',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class RefreshTokenExpiredException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_REFRESH_EXPIRED',
      message: 'Vui lòng đăng nhập lại',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class RefreshTokenRevokedException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_REFRESH_REVOKED',
      message: 'Phiên đã bị thu hồi',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

export class AccountLockedException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_ACCOUNT_LOCKED',
      message: 'Tài khoản tạm khóa, thử lại sau 15 phút',
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}

export class EmailExistsException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_EMAIL_EXISTS',
      message: 'Email đã được sử dụng',
      statusCode: HttpStatus.CONFLICT,
    });
  }
}

export class OAuthFailedException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_OAUTH_FAILED',
      message: 'Xác thực Google/Apple thất bại',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class ResetTokenInvalidException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_RESET_TOKEN_INVALID',
      message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

// ---- Resource Errors ----
export class ResourceNotFoundException extends AppException {
  constructor(resource: string) {
    super({
      errorCode: 'RESOURCE_NOT_FOUND',
      message: `${resource} không tìm thấy`,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}

export class ResourceForbiddenException extends AppException {
  constructor() {
    super({
      errorCode: 'RESOURCE_FORBIDDEN',
      message: 'Bạn không có quyền truy cập',
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}

export class ResourceConflictException extends AppException {
  constructor(resource: string) {
    super({
      errorCode: 'RESOURCE_CONFLICT',
      message: `${resource} đã tồn tại`,
      statusCode: HttpStatus.CONFLICT,
    });
  }
}

// ---- Business Logic Errors ----
export class MaxProfilesException extends AppException {
  constructor(max: number) {
    super({
      errorCode: 'BIZ_MAX_PROFILES',
      message: `Đã đạt giới hạn ${max} profile`,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class CannotDeletePrimaryException extends AppException {
  constructor() {
    super({
      errorCode: 'BIZ_CANNOT_DELETE_PRIMARY',
      message: 'Không thể xóa profile chính',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class PlanLimitException extends AppException {
  constructor(max: number) {
    super({
      errorCode: 'BIZ_PLAN_LIMIT',
      message: `Đã đạt giới hạn ${max} meal plan nháp`,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class LockLimitException extends AppException {
  constructor() {
    super({
      errorCode: 'BIZ_LOCK_LIMIT',
      message: 'Không thể lock quá 70% slots',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class InsufficientRecipesException extends AppException {
  constructor() {
    super({
      errorCode: 'BIZ_INSUFFICIENT_RECIPES',
      message: 'Không đủ món phù hợp filter để tạo gợi ý',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

// ---- Rate Limit Errors ----
export class SuggestionLimitException extends AppException {
  constructor() {
    super({
      errorCode: 'RATE_SUGGESTION_LIMIT',
      message: 'Bạn đã hết lượt gợi ý hôm nay. Nâng cấp Pro để không giới hạn',
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}

export class PasswordMismatchException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_PASSWORD_MISMATCH',
      message: 'Mật khẩu hiện tại không đúng',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class CannotDeleteActivePlanException extends AppException {
  constructor() {
    super({
      errorCode: 'BIZ_CANNOT_DELETE_ACTIVE',
      message: 'Không thể xóa thực đơn đang hoạt động. Hãy archive trước.',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class OAuthOnlyAccountException extends AppException {
  constructor() {
    super({
      errorCode: 'AUTH_OAUTH_ONLY',
      message: 'Tài khoản chỉ dùng OAuth, không có mật khẩu',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

