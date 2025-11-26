import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Standard error response format'
})
export class ErrorResponseDTO {
    @ApiProperty({
        description: 'Error message or array of error messages',
        example: 'Invalid email or password',
        oneOf: [
            {
                type: 'string', 
                example: 'Invalid email or password'
            },
            {
                type: 'array',
                items: {type: 'string'},
                example: ['email must be an email', 'password must be longer than 6 characters']
            }
        ]
    })
    message: string | string[];

    @ApiProperty({
        description: 'Error type/classification',
        example: 'Unauthorized',
        examples: ['Bad Request', 'Unauthorized', 'Forbidden', 'Not Found', 'Internal Server Error'],
        required: false
    })
    error?: string;

    @ApiProperty({
        description: 'HTTP status code',
        example: 401,
        examples: [400, 401, 403, 404, 409, 500]
    })
    statusCode: number;
}