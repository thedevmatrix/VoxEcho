import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    ping(){
        return "auth is active "
    }
}
