import {Injectable, NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

@Injectable()

export class SecurityMiddleware implements NestMiddleware {
  private readonly helmetMiddleware = helmet();
  private readonly limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

  use(req: Request, res: Response, next: NextFunction): void {
    this.helmetMiddleware(req, res, () => this.limiter(req, res, next));
  }
}
