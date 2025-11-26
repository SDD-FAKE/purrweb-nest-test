import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CheckOwnership, OwnershipGuard, SwaggerSuccessResponses, SwaggerErrorResponses } from 'src/common';
import { CardDTO, UpdateCardDTO } from './dto';
import { CommentsService } from 'src/comments/comments.service';
import { CardsService } from './cards.service';
import { CommentDTO, CreateCommentDTO } from 'src/comments/dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth('JWT-auth')
@Controller('cards')
@UseGuards(OwnershipGuard)
@ApiResponse(SwaggerErrorResponses.Unauthorized())
export class CardsController {
    constructor(
        private readonly cardsService: CardsService,
        private readonly commentService: CommentsService
    ) { }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Get card by ID',
        description: 'Returns a specific card by its ID with all details'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Card ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Card retrieved successfully',
        CardDTO
    ))
    @ApiResponse(SwaggerErrorResponses.NotFound('Card not found'))
    findOne(@Param('id', ParseUUIDPipe) cardId: string) {
        return this.cardsService.findOneOrThrow(cardId);
    }

    @Patch(':id')
    @CheckOwnership({idParam: 'id', entityType: 'card'})
    @ApiOperation({ 
        summary: 'Update card',
        description: 'Updates card. User must be the owner of the card. Also user must own the target column to move the card to another column'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Card ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiBody({ type: UpdateCardDTO })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Card updated successfully',
        CardDTO
    ))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this card'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Card not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    update(
        @CurrentUser('id') userId: string,
        @Param('id', ParseUUIDPipe) cardId: string,
        @Body() updateCardDto: UpdateCardDTO
    ) {
        return this.cardsService.update(userId, cardId, updateCardDto);
    }

    @Delete(':id')
    @CheckOwnership({idParam: 'id', entityType: 'card'})
    @ApiOperation({ 
        summary: 'Delete card',
        description: 'Deletes card and all its comments. User must be the owner of the card.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Card ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Success('Card deleted successfully'))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this card'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Card not found'))
    delete(@Param('id', ParseUUIDPipe) cardId: string) {
        return this.cardsService.delete(cardId);
    }

    @Get(':id/comments')
    @ApiOperation({ 
        summary: 'Get card comments',
        description: 'Returns all comments for a specific card'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Card ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok('Comments retrieved successfully', [CommentDTO]))
    @ApiResponse(SwaggerErrorResponses.NotFound('Card not found'))
    findComments(@Param('id', ParseUUIDPipe) cardId: string) {
        return this.commentService.findByCardId(cardId);
    }

    @Post(':id/comments')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Create comment on card',
        description: 'Creates a new comment on a specific card'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Card ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiBody({ type: CreateCommentDTO })
    @ApiResponse(SwaggerSuccessResponses.Created('Comment created successfully', CommentDTO))
    @ApiResponse(SwaggerErrorResponses.NotFound('Card not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    createComment(
        @CurrentUser('id') userId: string,
        @Param('id', ParseUUIDPipe) cardId: string,
        @Body() createCommentDto: CreateCommentDTO
    ) {
        return this.commentService.create(userId, cardId, createCommentDto);
    }
}