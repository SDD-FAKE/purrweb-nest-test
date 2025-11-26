import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

@ApiSchema({
    description: 'Data for updating an existing comment'
})
export class UpdateCommentDTO {
    @ApiPropertyOptional({
        title: 'Comment Text',
        description: 'Updated text content of the comment (optional)',
        example: 'This is a critical task that must be completed by Friday.',
        type: 'string',
        required: false,
        minLength: 1
    })
    @ValidateIf(o => o.text !== undefined)
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    text?: string;
}