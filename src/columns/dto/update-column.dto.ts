import { ApiPropertyOptional, ApiSchema } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

@ApiSchema({
    description: 'Data for updating an existing column'
})
export class UpdateColumnDTO {
    @ApiPropertyOptional({
        title: 'Column Title',
        description: 'New title for the column (optional)',
        example: 'Completed',
        type: 'string',
        required: false,
        nullable: false,
        minLength: 1,
        maxLength: 255
    })
    @ValidateIf(o => o.title !== undefined)
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title?: string;
}