import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";



@Injectable()
export class CustomConfigService {
    constructor(private configService: ConfigService) {}

    get nodeEnv(): string {
        const env = this.configService.get<string>('NODE_ENV');
        return env || 'development';
    }

    get databasePort(): number {
      const port = this.configService.get<number>('POSTGRES_PORT');
      if(!port){
        throw new Error(`
          PORT is not defined in the configuration `)

      }
        return port 

    }

    get dataBase(): string {
        const database = this.configService.get<string>('POSTGRES_DATABASE');
        if (!database) {
            throw new Error('DATABASE_URL is not defined in the configuration');
        }
        return database;
      }

        get databaseUsername(): string{
        const username= this.configService.get<string>("POSTGRES_USER");
        if(!username){
          throw new Error ('DATABASE_USER is not defined in configuration')
        }

        return username
      }

      get databasepass():string{
        const password = this.configService.get<string>('POSTGRES_PASSWORD');
        if(!password){
          throw new Error ('DATABASE PASSWORD is no defined in configuration')
        } 

        return password
      }
      
      get jwtSecret(): string {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the configuration');
        }
        return jwtSecret;
      }
      get jwtTokenExp(): string {
        const jwtTokenExpire = this.configService.get<string>('JWT_EXPIRES_IN');

        if (!jwtTokenExpire) {
            throw new Error('JWT_Token is not defined in the configuration');
        }
        return jwtTokenExpire;
      }

      get destination():string{
        const Destination = this.configService.get<string>('DEST');
        if(!Destination){
          throw new Error('destiantion is not  provided , please define destination in env file')
        }
        
        return Destination
      }

      //create a get method  , because we are geting an item through the env file. 
      get imageUploadSize():number{
        //create variable to  store  them in 
        const uploadSize = this.configService.get<number>('FILE_UPLOAD_SIZE')
        if(!uploadSize){
          throw new Error('')
        }

        return uploadSize; 
        
      }
    
}