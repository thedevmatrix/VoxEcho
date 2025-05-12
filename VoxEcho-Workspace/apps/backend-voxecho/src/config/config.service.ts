import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";



@Injectable()

export class CustomConfigService {
    constructor(private configService: ConfigService) {}

    get port(): number {
      const port = this.configService.get<number>('PORT');
      if(!port){
        throw new Error(`
          PORT is not defined in the configuration `)

      }
        return port 

    }

    get databaseUrl(): string {
        const databaseUrl = this.configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not defined in the configuration');
        }
        return databaseUrl;
      }

      get jwtSecret(): string {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the configuration');
        }
        return jwtSecret;
      }
}