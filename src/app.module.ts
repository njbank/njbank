import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { KfcModule } from './kfc/kfc.module';
import { DatabaseModule } from './database.modules';
import { NeosModule } from './neos/neos.modules';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    AuthModule,
    KfcModule,
    DatabaseModule,
    NeosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
