import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

@ApiSchema({
    description: 'User login credentials'
})
export class LoginDTO {
    @ApiProperty({
        title: 'Email Address',
        description: 'User email address for authentication',
        example: 'user@example.com',
        required: true,
        type: 'string',
        format: 'email'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        title: 'Password',
        description: 'User password for authentication', 
        example: 'password123',
        required: true,
        type: 'string',
        format: 'password'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}