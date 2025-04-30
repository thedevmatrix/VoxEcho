import cors = require('cors');
import { Request, Response, NextFunction } from 'express';



describe('CORS middleware',()=> {
   const CorsMiddleware = cors({
    origin: ['https://Your-frontend.com'],
    methods: ['POST', 'GET', 'OPTIONS'],

});
   

    it('should handle OPTIONS preflight requests', () => {
        const mockReq = {
            method: 'OPTIONS',
            headers: {
                origin: 'https://Your-frontend.com',
                'access-control-request-method': 'POST'
            }
        }as Request

        const mockRes = {
            setHeader: jest.fn(),
            getHeader: jest.fn(),
            removeHeader: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            end: jest.fn(),
            sendStatus: jest.fn()
          } as unknown as Response;
          

        const  mockNext = jest.fn();

        CorsMiddleware(mockReq, mockRes, mockNext);

        //verify CORS headers were set
        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Access-Control-Allow-Origin',
            'https://Your-frontend.com'
        );
       
    });
    
    it('should handle actual  requests', () => {
        const mockReq = { method: 'POST', 
        headers: {
            origin: 'https://Your-frontend.com'
         }
          }as Request;
    
        const mockRes = {
            setHeader : jest.fn(),
            getHeader: jest.fn(),
            removeHeader: jest.fn(),
            sendStatus: jest.fn(),
            end: jest.fn(),


        }as unknown as Response;
    
        const mockNext = jest.fn() as NextFunction;
    
        CorsMiddleware(mockReq, mockRes, mockNext);
        expect(mockRes.setHeader).toHaveBeenCalledWith(
           'Access-Control-Allow-Origin',
           'https://Your-frontend.com'
        );
    
    });
});

