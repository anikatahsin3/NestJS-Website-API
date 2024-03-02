import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { typeOrmAsyncConfig } from "./config/typeorm.config";
import { UserModule } from "./user/user.module";

@Module({
	imports: [UserModule, TypeOrmModule.forRootAsync(typeOrmAsyncConfig), AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
