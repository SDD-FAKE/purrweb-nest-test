import { ApiProperty, ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

@ApiSchema({
    description: 'Data for creating a new card'
})
export class CreateCardDTO {
    @ApiProperty({
        title: 'Card Title',
        description: 'Title of the card to be created',
        example: 'Implement user authentication',
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiPropertyOptional({
        title: 'Card Description',
        description: 'Detailed description of the card (optional, nullable)',
        example: 'Implement JWT authentication with refresh tokens',
        type: 'string',
        minLength: 1,
        required: false,
        nullable: true
    })
    @IsString()
    @MinLength(1)
    @IsOptional()
    description?: string;
}