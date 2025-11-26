import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, SwaggerErrorResponses, SwaggerSuccessResponses } from 'src/common';
import { SafeUserDTO, UpdateUserDTO } from './dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@ApiResponse(SwaggerErrorResponses.Unauthorized())
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ 
        summary: 'Get current user',
        description: 'Returns the currently authenticated user'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Current user retrieved successfully',
        type: SafeUserDTO
    })
    getCurrentUser(@CurrentUser() user: SafeUserDTO) {
        return user;
    }

    @Patch('me')
    @ApiOperation({ 
        summary: 'Update current user',
        description: 'Updates the currently authenticated user'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'User updated successfully',
        type: SafeUserDTO
    })
    @ApiResponse(SwaggerErrorResponses.NotFound('User not found'))
    @ApiResponse(SwaggerErrorResponses.Conflict('Email already exists'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    updateCurrentUser(
        @CurrentUser('id') userId: string,
        @Body() updateUserDto: UpdateUserDTO,
    ) {
        return this.usersService.update(userId, updateUserDto);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Get user by ID',
        description: 'Returns user by user ID'
    })
    @ApiParam({ 
        name: 'id', 
        type: String,
        format: 'uuid',
        description: 'User ID',
        example: 'a679008a-d613-4333-b462-efacf3884969'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'User profile retrieved successfully',
        SafeUserDTO
    ))
    @ApiResponse(SwaggerErrorResponses.NotFound('User not found'))
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getSafeUser(id);
    }
}