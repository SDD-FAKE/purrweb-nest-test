import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { RegisterDTO, LoginDTO, ChangePasswordDto } from './dto';
import { Public, CurrentUser, SwaggerErrorResponses, SwaggerSuccessResponses } from 'src/common/';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Register a new user',
        description: 'Creates a new user and sets refresh token cookies'
    })
    @ApiBody({type: RegisterDTO})
    @ApiResponse(SwaggerSuccessResponses.Created(
        'User successfully registered and refresh token cookies set',
        TokenResponseDto
    ))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    @ApiResponse(SwaggerErrorResponses.Conflict('Email already registered'))
    register(
        @Res({passthrough: true}) res: Response,
        @Body() registerDto: RegisterDTO
    ) {
        return this.authService.register(res, registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Login user',
        description: 'Authenticates user and sets refresh token cookies'
    })
    @ApiBody({type: LoginDTO})
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'User successfully authenticated and refresh token set',
        TokenResponseDto
    ))
    @ApiResponse(SwaggerErrorResponses.NotFound('User with this email or password was not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    login(
        @Res({passthrough: true}) res: Response,
        @Body() loginDto: LoginDTO
    ) {
        return this.authService.login(res, loginDto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh authentication tokens',
        description: 
            `Refreshes access token using the HTTP-only refresh token cookie that is automatically managed by the browser
            ❗Endpoint uses HttpOnly cookies for security and cannot be tested in Swagger, because Swagger UI cannot send HttpOnly cookies.❗
            Use Postman, Insomnia or curl.`
    })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Tokens successfully refreshed. New access token returned in response body.',
        TokenResponseDto
    ))
    @ApiResponse(SwaggerErrorResponses.Unauthorized('Invalid or expired refresh token'))
    @ApiResponse(SwaggerErrorResponses.NotFound('User not found'))
    refresh(
        @Req() req: Request,
        @Res({passthrough: true}) res: Response
    ) {
        return this.authService.refreshTokens(req, res);
    }

    @Public()
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Logout user',
        description: 'Clears refresh token cookies and logs out user',
    })
    @ApiResponse(SwaggerSuccessResponses.Success('User successfully logged out and cookies cleared'))
    logout(@Res({passthrough: true}) res: Response) {
        return this.authService.logout(res);
    }

    @Patch('password')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ 
        summary: 'Change user password',
        description: 'Changes the password for the authenticated user. Requires valid JWT token.'
    })
    @ApiBody({type: ChangePasswordDto})
    @ApiResponse(SwaggerSuccessResponses.Success('Password successfully changed'))
    @ApiResponse(SwaggerErrorResponses.Unauthorized())
    @ApiResponse(SwaggerErrorResponses.NotFound('User not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest('Current password is incorrect'))
    @ApiResponse(SwaggerErrorResponses.Conflict('New password must be different from current password'))
    changePassword(
        @CurrentUser('id') userId: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(userId, changePasswordDto);
    }

    @Delete('user')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ 
        summary: 'Delete user account',
        description: 'Permanently deletes the authenticated user account and clears cookies. Requires valid JWT token.'
    })
    @ApiResponse(SwaggerSuccessResponses.Success('User account successfully deleted'))
    @ApiResponse(SwaggerErrorResponses.Unauthorized())
    @ApiResponse(SwaggerErrorResponses.NotFound('User not found'))
    deleteAccount(
        @CurrentUser('id') userId: string,
        @Res({passthrough: true}) res: Response,
    ) {
        return this.authService.deleteAccount(userId, res);
    }
}