import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCommentDto } from '../modules/dto/incidentDto/incidentCommentdto';
@Injectable()
export class ValidateRequestMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    try {
      const dto = plainToInstance(CreateCommentDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException('Validation failed: ' + JSON.stringify(errors));
      }
      req.validatedBody = dto; // Attach validated DTO
      next();
    } catch (error) {
      const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
      res.status(400).json({ message });
    }
  }
} 


// AuthGuard → ValidationPipe → Controller method → Service logic → Return response.    method for authdfuards, validation pipe and also typeorm mthod for accessing comment . 
