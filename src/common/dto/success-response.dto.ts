import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Success response'
})
export class SuccessResponseDTO {
    @ApiProperty({
        description: 'Indicates if the request was successful',
        example: true,
    })
    success: boolean;
}