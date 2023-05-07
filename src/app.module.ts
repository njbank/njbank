import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { KfcModule } from './kfc/kfc.module';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { GetToHeaderMiddleware } from './middleware/auth/get-to-header.middleware';
import { NeosModule } from './neos/neos.modules';
import { RankingModule } from './ranking/ranking.module';
import { ShopModule } from './shop/shop.module';
import { SkinModule } from './skin/skin.module';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users/users.module';

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
