import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

@ApiSchema({
    description: 'User registration data'
})
export class RegisterDTO {
    @ApiProperty({
        title: 'Email Address',
        description: 'User email address for registration',
        example: 'user@example.com',
        required: true,
        type: 'string',
        maxLength: 255,
        format: 'email'
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;
    
    @ApiProperty({
        title: 'Password',
        description: 'User password for account creation',
        example: 'password123',
        required: true,
        type: 'string',
        minLength: 6,
        maxLength: 255,
        format: 'password'
    })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    @IsString()
    password: string;
}