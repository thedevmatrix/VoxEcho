import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get()
    ping(){
        return 'Auth route is active';
    }

}
