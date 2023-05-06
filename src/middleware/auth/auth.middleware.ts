import * as passport from 'passport';

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    passport.authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/api/unauthorized' },
      (value) => {
        if (value) {
          next();
        } else {
          throw new UnauthorizedException();
        }
      },
    )(req, res, next);
  }
}
