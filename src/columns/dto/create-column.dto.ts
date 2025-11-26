import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

@ApiSchema({
    description: 'Data for creating a new column'
})
export class CreateColumnDTO {
    @ApiProperty({
        title: 'Column Title',
        description: 'Title of the column to be created',
        example: 'In Progress',
        type: 'string',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;
}