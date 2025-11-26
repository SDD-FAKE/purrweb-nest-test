import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateIf } from "class-validator";

@ApiSchema({
    description: 'Data for updating an existing card'
})
export class UpdateCardDTO {
    @ApiPropertyOptional({
        title: 'Card Title',
        description: 'New title for the card (optional)',
        example: 'Implement user authentication system',
        type: 'string',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    @ValidateIf(o => o.title !== undefined)
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title?: string;

    @ApiPropertyOptional({
        title: 'Card Description',
        description: 'New description for the card (optional, nullable)',
        example: 'Implement JWT authentication with refresh tokens and guards',
        type: 'string',
        required: false,
        nullable: true,
        minLength: 1
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    description?: string;

    @ApiPropertyOptional({
        title: 'Column ID',
        description: 'New column ID for moving the card to another column',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        nullable: false,
        required: false
    })
    @ValidateIf(o => o.columnId !== undefined)
    @IsUUID()
    columnId?: string;
}