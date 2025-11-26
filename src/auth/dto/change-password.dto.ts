import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

@ApiSchema({
    description: 'Data for changing user password'
})
export class ChangePasswordDto {
    @ApiProperty({
        title: 'Current Password',
        description: 'Current user password for verification',
        example: 'password123',
        required: true,
        type: 'string',
        format: 'password'
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        title: 'New Password',
        description: 'New password for user',
        example: '123password',
        required: true,
        type: 'string',
        minLength: 6,
        maxLength: 255,
        format: 'password'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    newPassword: string;
}