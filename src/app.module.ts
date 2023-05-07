import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { KfcModule } from './api/kfc/kfc.module';
import { RankingModule } from './api/ranking/ranking.module';
import { ShopModule } from './api/shop/shop.module';
import { SkinModule } from './api/skin/skin.module';
import { TokenModule } from './api/token/token.module';
import { UsersModule } from './api/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { GetToHeaderMiddleware } from './middleware/auth/get-to-header.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { NeosModule } from './modules/neos/neos.modules';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    AuthModule,
    KfcModule,
    DatabaseModule,
    NeosModule,
    RankingModule,
    SkinModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetToHeaderMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'status', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
