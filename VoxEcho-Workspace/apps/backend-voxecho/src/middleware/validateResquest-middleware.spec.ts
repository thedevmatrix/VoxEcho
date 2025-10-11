// validate-request.middleware.spec.ts
import { ValidateRequestMiddleware } from './validateRequest-middleware';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';

describe('ValidateRequestMiddleware', () => {
  let middleware: ValidateRequestMiddleware;

  beforeEach(() => {
    middleware = new ValidateRequestMiddleware();
  });

  it('should call next() if validation passes', async () => {
    const req: any = { body: { content: 'Nice post!', incidentId: 1 } };
    const res: any = {};
    const next = jest.fn();

    jest.spyOn(classTransformer, 'plainToInstance').mockReturnValue(req.body as any);
    jest.spyOn(classValidator, 'validate').mockResolvedValue([]);

    await middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.validatedBody).toEqual(req.body);
  });

  it('should return 400 if validation fails', async () => {
    const req: any = { body: {} };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest.spyOn(classValidator, 'validate').mockResolvedValue([{} as any]);

    await middleware.use(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Validation failed') })
    );
  });

  it('should handle unexpected errors', async () => {
    const req: any = { body: {} };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    jest.spyOn(classValidator, 'validate').mockRejectedValue(new Error('Unexpected error'));

    await middleware.use(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
  });
});
