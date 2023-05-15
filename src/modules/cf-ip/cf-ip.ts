import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CfIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.headers['CF-Connecting-IP']) {
      return request.headers['CF-Connecting-IP'];
    }
    if (request.headers['cf-connecting-ip']) {
      return request.headers['cf-connecting-ip'];
    }
    return request.client.remoteAddress;
  },
);
