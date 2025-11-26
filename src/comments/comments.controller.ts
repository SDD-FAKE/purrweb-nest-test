import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { OwnershipGuard, CheckOwnership, SwaggerSuccessResponses, SwaggerErrorResponses } from 'src/common';
import { CommentDTO, UpdateCommentDTO } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@Controller('comments')
@ApiResponse(SwaggerErrorResponses.Unauthorized())
@UseGuards(OwnershipGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Get comment by ID',
        description: 'Returns a specific comment by its ID'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Comment ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Comment retrieved successfully',
        CommentDTO
    ))
    @ApiResponse(SwaggerErrorResponses.NotFound('Comment not found'))
    findOne(@Param('id', ParseUUIDPipe) commentId: string) {
        return this.commentsService.findOneOrThrow(commentId);
    }

    @Patch(':id')
    @CheckOwnership({idParam: 'id', entityType: 'comment'})
    @ApiOperation({ 
        summary: 'Update comment',
        description: 'Updates a specific comment. User must be the owner of the comment.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Comment ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiBody({type: UpdateCommentDTO})
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Comment updated successfully',
        CommentDTO
    ))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this comment'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Comment not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    update(
        @Param('id', ParseUUIDPipe) commentId: string,
        @Body() updateCommentDto: UpdateCommentDTO
    ) {
        return this.commentsService.update(commentId, updateCommentDto);
    }

    @Delete(':id')
    @CheckOwnership({idParam: 'id', entityType: 'comment'})
    @ApiOperation({ 
        summary: 'Delete comment',
        description: 'Deletes a specific comment. User must be the owner of the comment.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Comment ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Success('Comment deleted successfully'))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this comment'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Comment not found'))
    delete(
        @Param('id', ParseUUIDPipe) commentId: string
    ) {
        return this.commentsService.delete(commentId);
    }
}
