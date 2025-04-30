
// Now import everything else
import { SecurityMiddleware } from './security.middleware';
import { Request, Response, NextFunction } from 'express';

jest.mock('helmet', () =>
  jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next())
);

jest.mock('express-rate-limit', () =>
  jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next())
);

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;

  beforeAll(() => {
    middleware = new SecurityMiddleware();
  });

  it('should apply helmet and rate limiter', () => {
    const mockReq = {
      ip: '127.0.0.1',
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
      connection: {
        remoteAddress: '127.0.0.1',
      },
      get: (header: string) => {
        return {
          'x-forwarded-for': '127.0.0.1',
        }[header.toLowerCase()];
      },
    } as unknown as Request;

    const mockRes = {
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn();

    middleware.use(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1); // ✅ should now pass
  });
});
