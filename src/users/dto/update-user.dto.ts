import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, ValidateIf } from "class-validator";

@ApiSchema({
    description: 'Data for updating user profile'
})
export class UpdateUserDTO {
    @ApiPropertyOptional({
        title: 'Email Address',
        description: 'New email address for the user (optional)',
        example: 'newemail@example.com',
        type: 'string',
        required: false,
        format: 'email'
    })
    @ValidateIf(o => o.email !== undefined)
    @IsEmail()
    @IsNotEmpty()
    email?: string;
}