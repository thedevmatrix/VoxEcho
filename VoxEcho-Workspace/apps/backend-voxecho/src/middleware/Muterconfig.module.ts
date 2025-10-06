import {Module} from '@nestjs/common'
import { MulterModule } from "@nestjs/platform-express";
import { CustomConfigService } from "../config/config.service";

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: (config: CustomConfigService) => {
                const dest = config.destination; // note use this dest 
                if (!dest) {
                    throw new Error("dest must be provided");
                }
                return {
                    dest
                }
            },
            inject: [CustomConfigService]
        })
    ],

})
export class multerConfig{}