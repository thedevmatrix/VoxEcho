import { Controller, Get, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetCommentsQueryDto } from './dto/get-comments.dto';
import { AuthGuard } from '../auth/AuthJwt.strategy';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':incidentId')
  async getCommentsByIncidentId(
    @Param('incidentId') incidentId: string,
    @Query(new ValidationPipe({ transform: true })) query: GetCommentsQueryDto
  ) {
    return this.commentsService.getCommentsByIncidentId(incidentId, query);
  }
}
