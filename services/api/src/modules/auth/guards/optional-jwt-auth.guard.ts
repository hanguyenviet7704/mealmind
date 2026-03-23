import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard cho phép request không có token vẫn đi qua.
 * Nếu có token hợp lệ → req.user được set.
 * Nếu không có token hoặc token sai → req.user = null, request vẫn tiếp tục.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Gọi super để xử lý JWT nếu có
    return super.canActivate(context);
  }

  handleRequest<T>(err: Error | null, user: T): T {
    // Không throw error - cho phép request tiếp tục dù không có user
    return user;
  }
}
