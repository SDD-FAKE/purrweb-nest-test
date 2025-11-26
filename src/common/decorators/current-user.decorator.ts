import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { User } from '../generated/prisma/browser';

export const CurrentUser = createParamDecorator(
    (data: keyof Omit<User, 'passwordHash'>, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest() as Request;
        const user = request.user;

        if(!user) {
            throw new UnauthorizedException("User is not authenticated");
        }

        return data ? user[data] : user;
    },
);
