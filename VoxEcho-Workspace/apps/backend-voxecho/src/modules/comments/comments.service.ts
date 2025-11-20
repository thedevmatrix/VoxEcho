import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entities /comment.entity';
import { GetCommentsQueryDto } from './dto/get-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async getCommentsByIncidentId(
    incidentId: string,
    query: GetCommentsQueryDto
  ) {
    const parsedId = Number(incidentId);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid incident ID format');
    }

    const {
      offset = 0,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    try {
      const queryResult = await Promise.race([
        this.commentRepository.findAndCount({
          where: {
            postId: parsedId,
            parentId: IsNull(), // Get only top-level comments
          },
          skip: offset,
          take: Math.min(limit, 100), // Prevent excessive data fetching
          order: { [sortBy]: sortOrder },
          relations: ['children', 'user'],
          cache: true, // Enable query caching for better performance
        }),
        new Promise<[Comment[], number]>((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 5000)
        )
      ]);

      const [comments, total] = queryResult;

      if (!comments) {
        throw new Error('Database query failed');
      }

      if (!comments.length && offset === 0) {
        throw new NotFoundException(`No comments found for incident ${incidentId}`);
      }

      return {
        data: comments,
        meta: {
          total,
          offset,
          limit: Math.min(limit, 100),
          hasMore: offset + comments.length < total,
        },
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.message === 'Database query timeout') {
        throw new RequestTimeoutException('Request timed out while fetching comments');
      }
      // Log the error internally
      console.error('Error fetching comments:', error);
      throw new InternalServerErrorException('Failed to fetch comments');
    }
  }
}
