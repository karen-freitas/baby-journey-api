import { AuthGuard } from '../../../src/adapter/guards/auth-guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = new JwtService({});
    configService = new ConfigService();
    authGuard = new AuthGuard(jwtService, configService);
  });

  afterEach(() => {
  jest.restoreAllMocks();
});

  describe('canActivate', () => {
    it('should return true if token is valid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });
      jest.spyOn(configService, 'get').mockReturnValue('secret');

      const result = await authGuard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual({ userId: 1 });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalidToken',
        },
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));
      jest.spyOn(configService, 'get').mockReturnValue('secret');

      await expect(authGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      const mockRequest = {
        headers: {},
      } as Request;

      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      await expect(authGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should return the token if Bearer token is provided', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request;

      const token = authGuard['extractTokenFromHeader'](mockRequest);

      expect(token).toBe('validToken');
    });

    it('should return undefined if no Bearer token is provided', () => {
      const mockRequest = {
        headers: {
          authorization: 'Basic someToken',
        },
      } as Request;

      const token = authGuard['extractTokenFromHeader'](mockRequest);

      expect(token).toBeUndefined();
    });

    it('should return undefined if no authorization header is provided', () => {
      const mockRequest = {
        headers: {},
      } as Request;

      const token = authGuard['extractTokenFromHeader'](mockRequest);

      expect(token).toBeUndefined();
    });
  });
});