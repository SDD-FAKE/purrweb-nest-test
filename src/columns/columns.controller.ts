import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { OwnershipGuard, CheckOwnership, CurrentUser, SwaggerErrorResponses, SwaggerSuccessResponses } from 'src/common';
import { ColumnDTO, CreateColumnDTO, UpdateColumnDTO } from './dto';
import { CardsService } from 'src/cards/cards.service';
import { CardDTO, CreateCardDTO } from 'src/cards/dto';

@ApiTags('Columns')
@ApiBearerAuth('JWT-auth')
@Controller('columns')
@ApiResponse(SwaggerErrorResponses.Unauthorized())
@UseGuards(OwnershipGuard)
export class ColumnsController {
    constructor(
        private readonly columnsService: ColumnsService,
        private readonly cardsService: CardsService
    ) { }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Create a new column',
        description: 'Creates a new column for the authenticated user'
    })
    @ApiBody({type: CreateColumnDTO})
    @ApiResponse(SwaggerSuccessResponses.Created(
        'Column created successfully',
        ColumnDTO
    ))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    create(
        @CurrentUser('id') userId: string,
        @Body() createColumnDto: CreateColumnDTO
    ) {
        return this.columnsService.create(userId, createColumnDto);
    }

    @Get('/')
    @ApiOperation({ 
        summary: 'Get user columns',
        description: 'Returns all columns belonging to the authenticated user'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'User columns retrieved successfully',
        [ColumnDTO]
    ))
    find(@CurrentUser('id') userId: string) {
        return this.columnsService.findByOwnerId(userId);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Get column by ID',
        description: 'Returns a specific column by its ID'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Column ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Column retrieved successfully',
        ColumnDTO
    ))
    @ApiResponse(SwaggerErrorResponses.NotFound('Column not found'))
    findOne(@Param('id', ParseUUIDPipe) columnId: string) {
        return this.columnsService.findOneOrThrow(columnId);
    }

    @Patch(':id')
    @CheckOwnership({idParam: 'id', entityType: 'column'})
    @ApiOperation({ 
        summary: 'Update column',
        description: 'Updates a specific column. User must be the owner of the column.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Column ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiBody({type: UpdateColumnDTO})
    @ApiResponse(SwaggerSuccessResponses.Ok(
        'Column updated successfully',
        ColumnDTO
    ))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this column'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Column not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    update(
        @Param('id', ParseUUIDPipe) columnId: string,
        @Body() updateColumnDto: UpdateColumnDTO
    ) {
        return this.columnsService.update(columnId, updateColumnDto);
    }

    @Delete(':id')
    @CheckOwnership({idParam: 'id', entityType: 'column'})
    @ApiOperation({ 
        summary: 'Delete column',
        description: 'Deletes a specific column and all its cards. User must be the owner of the column.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Column ID',
        example: 'a679008a-d613-4333-b462-efacf3884969s',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Success('Column deleted successfully'))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this column'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Column not found'))
    delete(
        @Param('id', ParseUUIDPipe) columnId: string,
    ) {
        return this.columnsService.delete(columnId);
    }

    @Get(':id/cards')
    @ApiOperation({ 
        summary: 'Get column cards',
        description: 'Returns all cards belonging to a specific column'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Column ID',
        example: 'a679008a-d613-4333-b462-efacf3884969',
        format: 'uuid'
    })
    @ApiResponse(SwaggerSuccessResponses.Ok('Cards retrieved successfully', [CardDTO]))
    @ApiResponse(SwaggerErrorResponses.NotFound('Column not found'))
    findCards(@Param('id', ParseUUIDPipe) columnId: string) {
        return this.cardsService.findByColumnId(columnId);
    }

    @Post(':id/cards')
    @HttpCode(HttpStatus.CREATED)
    @CheckOwnership({idParam: 'id', entityType: 'column'})
    @ApiOperation({ 
        summary: 'Create card in column',
        description: 'Creates a new card in a specific column. User must be the owner of the column.'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Column ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid'
    })
    @ApiBody({type: CreateCardDTO})
    @ApiResponse(SwaggerSuccessResponses.Created('Card created successfully', CardDTO))
    @ApiResponse(SwaggerErrorResponses.Forbidden('You are not the owner of this column'))
    @ApiResponse(SwaggerErrorResponses.NotFound('Column not found'))
    @ApiResponse(SwaggerErrorResponses.BadRequest())
    createCard(
        @CurrentUser('id') userId: string,
        @Param('id', ParseUUIDPipe) columnId: string,
        @Body() createCardDto: CreateCardDTO
    ) {
        return this.cardsService.create(userId, columnId, createCardDto);
    }
}