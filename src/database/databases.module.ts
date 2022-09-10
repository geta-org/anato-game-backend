import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserRepository } from './user.repository';

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
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserRepository],
  exports: [TypeOrmModule.forFeature([User]), UserRepository],
})
export class DatabaseModule {}
