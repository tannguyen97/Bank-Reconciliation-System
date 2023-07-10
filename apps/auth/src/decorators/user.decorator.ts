import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

export const getCurrentUserByContext = (context: ExecutionContext): UserDto => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user;
    }
    if (context.getType() === 'rpc') {
      return context.switchToRpc().getData().user;
    }
};

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx)
);
