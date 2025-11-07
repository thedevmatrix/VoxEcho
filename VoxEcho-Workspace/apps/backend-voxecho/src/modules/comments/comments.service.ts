import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities /comment.entity';
import { GetCommentsQueryDto } from './dto/get-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async getCommentsByIncidentId(incidentId: string, query: GetCommentsQueryDto) {
    const { offset = 0, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { incident: { id: incidentId } },
      skip: offset,
      take: limit,
      order: { [sortBy]: sortOrder },
      relations: ['replies', 'author'],
    });

    if (!comments.length && offset === 0) {
      throw new NotFoundException(`No comments found for incident ${incidentId}`);
    }

    return {
      data: comments,
      meta: {
        total,
        offset,
        limit,
        hasMore: offset + comments.length < total,
      },
    };
  }
}
