//import the nest .ts test file module.
import {Test , TestingModule  } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config';
import {envSchema} from './validation'; 


describe('Config Validation', () => {
    let  configService : ConfigService;


    beforeAll(async()=> {
        const module: TestingModule =  await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    validate: (config) => {
                        const parsed = envSchema.safeParse(config);
                        if(!parsed.success) throw new Error(parsed.error.message);
                        return parsed.data
                    }
                })
            ],

        }).compile();
        configService = module.get(ConfigService);
    }); 
    it('should return the correct port', ()=> {
        expect(configService.get('PORT')).toBeDefined();
    });
});