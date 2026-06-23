import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthGrpcClient } from './auth.grpc';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth.v1',
            protoPath: 'node_modules/@apcinema/contracts/proto/auth.proto',
            url: configService.getOrThrow<string>('AUTH_GRPC_URL')
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthGrpcClient],
})
export class AuthModule { }
