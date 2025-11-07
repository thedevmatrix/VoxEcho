import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entities /comment.entity';
import { CommentsService } from './comments.service';
import { NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comment>;

      const mockComments = [
        {
          id: 1,
          content: 'Test comment',
          user: { id: 1, username: 'user1' },
          children: [],
          postId: 1,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([mockComments, 2]),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  describe('getCommentsByIncidentId', () => {
    it('should return comments with pagination metadata', async () => {
      const result = await service.getCommentsByIncidentId('1', {
        offset: 0,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { 
          postId: 1,
          parentId: IsNull()
        },
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
        relations: ['children', 'user'],
      });

      expect(result.data).toEqual(mockComments);
      expect(result.meta).toEqual({
        total: 2,
        offset: 0,
        limit: 10,
        hasMore: false,
      });
    });

    it('should throw NotFoundException when no comments found', async () => {
      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([[], 0]);

      await expect(
        service.getCommentsByIncidentId('nonexistent', {
          offset: 0,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
