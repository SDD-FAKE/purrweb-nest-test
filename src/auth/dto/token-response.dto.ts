import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
    description: 'Token response for authentication'
})
export class TokenResponseDto {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE2NzkwMDhhLWQ2MTMtNDMzMy1iNDYyLWVmYWNmMzg4NDk2OSIsImlhdCI6MTc2NDA2MDk0MiwiZXhwIjoxNzY0MDY4MTQyfQ.47vcphz08AcuIjIXR54b5DLUf3aJuC1GpF2Jkwc9qBA'
    })
    accessToken: string;
}