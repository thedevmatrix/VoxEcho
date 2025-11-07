import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    getCommentsByIncidentId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  describe('getCommentsByIncidentId', () => {
    it('should return comments with pagination metadata', async () => {
      const mockResult = {
        data: [
          {
            id: '1',
            content: 'Test comment',
            incidentId: 'incident1',
          },
        ],
        meta: {
          total: 1,
          offset: 0,
          limit: 10,
          hasMore: false,
        },
      };

      mockCommentsService.getCommentsByIncidentId.mockResolvedValue(mockResult);

      const result = await controller.getCommentsByIncidentId('incident1', {
        offset: 0,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });

      expect(result).toEqual(mockResult);
      expect(service.getCommentsByIncidentId).toHaveBeenCalledWith('incident1', {
        offset: 0,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
    });
  });
});
