import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfrastructureModule } from '@infrastructure/users/user-infrastructure.module';
import { UserInterfaceModule } from '@interfaces/users/user-interface.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key-change-in-production'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MONGODB_HOST', 'localhost');
        const port = configService.get<string>('MONGODB_PORT', '27017');
        const database = configService.get<string>('MONGODB_DATABASE', 'demo3');
        
        // Si existe MONGODB_URI, usarlo directamente, sino construir la URI
        const uri = configService.get<string>('MONGODB_URI') 
          || `mongodb://${host}:${port}/${database}`;
        
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    UserInfrastructureModule,
    UserInterfaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


