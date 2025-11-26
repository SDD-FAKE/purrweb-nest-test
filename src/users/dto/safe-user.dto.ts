import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Safe user data without sensitive information'
})
export class SafeUserDTO {
    @ApiProperty({
        title: 'User ID',
        description: 'Unique identifier of the user',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        title: 'Email Address',
        description: 'User email address used for authentication',
        example: 'user@example.com',
        format: 'email',
        maxLength: 255
    })
    email: string;

    @ApiProperty({
        title: 'Created At',
        description: 'Timestamp when the user account was created',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time'
    })
    createdAt: Date;

    @ApiProperty({
        title: 'Updated At',
        description: 'Timestamp when the user account was last updated',
        example: '2025-01-01T00:00:00.000Z',
        type: 'string',
        format: 'date-time'
    })
    updatedAt: Date;
}