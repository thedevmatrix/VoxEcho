import { Controller, Get} from '@nestjs/common';

@Controller('incidents')
export class IncidentsController {
    @Get()
    ping(){
        return 'incident route is active '
    }
}
