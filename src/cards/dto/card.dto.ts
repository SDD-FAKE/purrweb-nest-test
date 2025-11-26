import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Card data structure with task information'
})
export class CardDTO {
    @ApiProperty({
        title: 'Card ID',
        description: 'Unique identifier of the card',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        title: 'Card Title',
        description: 'Title of the card',
        example: 'Implement user authentication',
        type: 'string',
        maxLength: 255
    })
    title: string;

    @ApiProperty({
        title: 'Card Description',
        description: 'Detailed description of the card',
        example: 'Implement JWT authentication with refresh tokens',
        type: 'string',
        required: false,
        nullable: true
    })
    description?: string;

    @ApiProperty({
        title: 'Owner ID',
        description: 'ID of the user who owns this card',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    ownerId: string;

    @ApiProperty({
        title: 'Column ID',
        description: 'ID of the column this card belongs to',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    columnId: string;

    @ApiProperty({
        title: 'Created At',
        description: 'Timestamp when the card was created',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time'
    })
    createdAt: Date;

    @ApiProperty({
        title: 'Updated At',
        description: 'Timestamp when the card was last updated',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time'
    })
    updatedAt: Date;
}