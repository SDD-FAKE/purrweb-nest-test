import { HttpStatus } from '@nestjs/common';
import { ErrorResponseDTO, SuccessResponseDTO } from '../dto';
import { ErrorExamples } from './error-examples';

export const SwaggerErrorResponses = {
    BadRequest: (description?: string) => ({
        status: HttpStatus.BAD_REQUEST,
        description: description ?? 'Bad Request - Validation error',
        type: ErrorResponseDTO,
        example: ErrorExamples.ValidationError
    }),
    Unauthorized: (description?: string) => ({
        status: HttpStatus.UNAUTHORIZED,
        description: description ?? 'Unauthorized - Invalid or missing authentication token',
        type: ErrorResponseDTO,
        example: ErrorExamples.Unauthorized
    }),
    Forbidden: (description?: string) => ({
        status: HttpStatus.FORBIDDEN,
        description: description ?? 'Forbidden - Insufficient permissions',
        type: ErrorResponseDTO,
        example: ErrorExamples.Forbidden
    }),
    NotFound: (description?: string) => ({
        status: HttpStatus.NOT_FOUND,
        description: description ?? 'Not Found - Resource not found',
        type: ErrorResponseDTO,
        example: ErrorExamples.NotFound
    }),
    Conflict: (description?: string) => ({
        status: HttpStatus.CONFLICT,
        description: description ?? 'Conflict - Resource already exists',
        type: ErrorResponseDTO,
        example: ErrorExamples.Conflict
    }),
    InternalServerError: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
        type: ErrorResponseDTO,
    }
};

export const SwaggerSuccessResponses = {
    Ok: (description?: string, type?: any) => ({
        status: HttpStatus.OK, 
        description: description ?? 'Operation completed successfully',
        type
    }),
    Created: (description?: string, type?: any) => ({
        status: HttpStatus.CREATED, 
        description: description ?? 'Resource created successfully',
        type
    }),
    Success: (description?: string) => ({
        status: HttpStatus.OK,
        description: description ?? 'Operation completed successfully',
        type: SuccessResponseDTO
    }),
};