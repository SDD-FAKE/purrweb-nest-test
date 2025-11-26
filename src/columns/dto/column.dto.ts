import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Column data structure'
})
export class ColumnDTO {
    @ApiProperty({
        title: 'Column ID',
        description: 'Unique identifier of the column',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    id: string;

    @ApiProperty({
        title: 'Column Title',
        description: 'Title of the column',
        example: 'In Progress',
        type: 'string',
        maxLength: 255
    })
    title: string;

    @ApiProperty({
        title: 'Owner ID',
        description: 'ID of the user who owns this column',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    ownerId: string;

    @ApiProperty({
        title: 'Created At',
        description: 'Timestamp when the column was created',
        example: '2025-01-15T10:30:00.000Z',
        format: 'date-time'
    })
    createdAt: Date;

    @ApiProperty({
        title: 'Updated At',
        description: 'Timestamp when the column was last updated',
        example: '2025-01-20T14:45:00.000Z',
        format: 'date-time'
    })
    updatedAt: Date;
}