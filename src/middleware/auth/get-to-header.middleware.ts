import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class GetToHeaderMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.rawHeaders.includes('apikey') && req.query['apikey']) {
      req.headers['apikey'] = req.query['apikey'];
    }
    next();
  }
}
