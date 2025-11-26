export const ErrorExamples = {
    ValidationError: {
        statusCode: 400,
        message: [
            'title must be shorter than or equal to 255 characters',
            'email must be an email'
        ],
        error: 'Bad Request',
    },
    Unauthorized: {
        value: {
            statusCode: 401,
            message: 'Invalid or expired JWT token',
            error: 'Unauthorized',
        }
    },
    Forbidden: {
        value: {
            statusCode: 403,
            message: 'You are not the owner of this column',
            error: 'Forbidden',
        }
    },
    NotFound: {
        value: {
            statusCode: 404,
            message: 'User not found',
            error: 'Not Found',
        }
    },
    Conflict: {
        value: {
            statusCode: 409,
            message: 'Resource already exist',
            error: 'Conflict',
        }
    }
};