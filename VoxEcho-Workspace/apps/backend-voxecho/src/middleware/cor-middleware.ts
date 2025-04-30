import cors = require('cors'); 
import { Request , Response,  NextFunction} from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';



@Injectable()

export class CorsMiddleware  implements NestMiddleware {
    private corsOptions = cors({
        origin: ['https://Your-frontend.com'],
        methods: ['POST', 'GET', 'OPTIONS'],  
      }); 
      use(req: Request, res: Response, next: NextFunction){
        this.corsOptions(req, res, next)
      }
}