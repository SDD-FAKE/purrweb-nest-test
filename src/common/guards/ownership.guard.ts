import { CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma.service';
import { OWNERSHIP_KEY } from '../decorators/check-ownership.decorator';
import { OwnershipOptions } from '../interfaces';
import { isUUID } from 'class-validator';
import { EntityType } from '../type';

@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const options = this.reflector.get<OwnershipOptions>(
            OWNERSHIP_KEY,
            context.getHandler(),
        );

        if(!options) return true;

        const entityId = request.params[options.idParam || 'id'];

        if(!entityId) {
            throw new NotFoundException('Entity ID not found');
        }

        if(!isUUID(entityId)) {
            throw new BadRequestException('Validation failed (uuid is expected)');
        }

        const entity = await this.findEntity(options.entityType, entityId);

        if(!entity) {
            throw new NotFoundException('Entity not found');
        }

        const ownerId = this.getOwnerId(entity, options.entityType);

        if(ownerId !== user.id) {
            throw new ForbiddenException('You are not the owner of this entity');
        }

        return true;
    }

    private async findEntity(entityType: string, entityId: string) {
        switch(entityType) {
            case 'user':
                return this.prisma.user.findUnique({
                    where: {id: entityId}
                });
            case 'column':
                return this.prisma.column.findUnique({
                    where: {id: entityId}
                });
            case 'card':
                return this.prisma.card.findUnique({
                    where: {id: entityId}
                });
            case 'comment':
                return this.prisma.comment.findUnique({
                    where: {id: entityId}
                });
            default:
                throw new BadRequestException(`Unknown entity type: ${entityType}`);
        }
    }

    private getOwnerId(entity: any, entityType: EntityType): string {
        switch(entityType) {
            case 'user':
                return entity.id;
            case 'column':
                return entity.ownerId;
            case 'card':
                return entity.ownerId;
            case 'comment':
                return entity.ownerId;
            default:
                throw new BadRequestException(`Unknown entity type: ${entityType}`);
        }
    }
}