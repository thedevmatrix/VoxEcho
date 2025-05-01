import { Injectable } from '@nestjs/common';

@Injectable()
export class IncidentsService {
    ping(){
        return 'incident service is working'
    }
}
