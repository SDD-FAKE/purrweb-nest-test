import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Comment data structure'
})
export class CommentDTO {
    @ApiProperty({
        title: 'Comment ID',
        description: 'Unique identifier of the comment',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        title: 'Comment Text',
        description: 'Text content of the comment',
        example: 'This task needs to be completed by Friday',
        type: 'string',
        maxLength: 1000
    })
    text: string;

    @ApiProperty({
        title: 'Owner ID',
        description: 'ID of the user who created this comment',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    ownerId: string;

    @ApiProperty({
        title: 'Card ID',
        description: 'ID of the card this comment belongs to',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    cardId: string;

    @ApiProperty({
        title: 'Created At',
        description: 'Timestamp when the comment was created',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time'
    })
    createdAt: Date;

    @ApiProperty({
        title: 'Updated At',
        description: 'Timestamp when the comment was last updated',
        example: '2025-01-01T00:00:00.000Z',
        format: 'date-time'
    })
    updatedAt: Date;
}