import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('HOST_DATABASE') || 'localhost',
        port: Number(configService.get('PORT_DATABASE')) || 5432,
        username: configService.get('USER_DATABASE') || 'postgres',
        password: configService.get('PASS_DATABASE') || 'root',
        database: configService.get('NAME_DATABASE') || 'dev',
        entities: [User],
      }),
    }),
  ],
})
export class DatabaseModule {}
