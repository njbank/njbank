import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SetHeadersMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: (error?: any) => void) {
    res.setHeader('x-robots-tag', 'noindex');
    next();
  }
}
