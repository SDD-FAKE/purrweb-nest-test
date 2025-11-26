import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

@ApiSchema({
    description: 'Data for creating a new comment'
})
export class CreateCommentDTO {
    @ApiProperty({
        title: 'Comment Text',
        description: 'Text content of the comment',
        example: 'This is an important task that needs to be completed soon.',
        type: 'string',
        required: true,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    text: string;
}