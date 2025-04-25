import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";



@Injectable()

export class CustomConfigService {
    constructor(private configService: ConfigService) {}

    get port(): number {
        return parseInt(this.configService.get('PORT')!);

    }

    get databaseUrl(): string {
        return this.configService.get<string>('DATABASE_URL')!;
      }

      get jwtSecret(): string {
        return this.configService.get<string> ('JWT_SECRET')!
      }
}