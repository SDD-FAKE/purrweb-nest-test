import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/common/generated/prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
        if(await this.userWithEmailExist(data.email)) {
            throw new ConflictException(`User with Email ${data.email} already exist`);
        }

        return await this.prismaService.user.create({
            data,
        });
    }

    async findById(id: string) {
        return await this.prismaService.user.findUnique({
            where: {
                id
            }
        });
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
    }

    async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) {
        const user = await this.findById(id);

        if(!user) {
            throw new NotFoundException('User not found')
        }

        if(data.email) {
            if(user.email != data.email && await this.userWithEmailExist(data.email)) {
                throw new ConflictException(`User with Email ${data.email} already exist`);
            }
        }

        const {passwordHash , ...safeUser} = await this.prismaService.user.update({
            where: {
                id
            },
            data: data,
        });

        return safeUser;
    }

    async delete(id: string) {
        return await this.prismaService.user.delete({
            where: {
                id
            }
        });
    }

    async userWithEmailExist(email: string) {
        return await (this.prismaService.user.count({
            where: {
                email
            }
        })) > 0;
    }
    
    async getSafeUser(userId: string) {
        const user = await this.findById(userId);

        if(!user) {
            throw new NotFoundException('User not found');
        }

        const {passwordHash , ...safeUser} = user;

        return safeUser;
    }
}
