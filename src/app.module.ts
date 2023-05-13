import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { KfcModule } from './endpoints/kfc/kfc.module';
import { RankingModule } from './endpoints/ranking/ranking.module';
import { ShopModule } from './endpoints/shop/shop.module';
import { SkinModule } from './endpoints/skin/skin.module';
import { TokenModule } from './endpoints/token/token.module';
import { UsersModule } from './endpoints/users/users.module';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { ApiKey } from './middleware/auth/entities/api-key.entity';
import { Permission } from './middleware/auth/entities/permission.entity';
import { NeosModule } from './modules/neos/neos.modules';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    KfcModule,
    DatabaseModule,
    NeosModule,
    RankingModule,
    SkinModule,
    ShopModule,
    TypeOrmModule.forFeature([ApiKey, Permission]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: '/status', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
