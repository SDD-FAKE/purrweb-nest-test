import { hash } from 'bcrypt';
import { BaseFactory } from './base.factory';
import { User } from 'src/common/generated/prisma/client';

export class UserFactory extends BaseFactory<User> {
    async create(userData: {email: string; password: string}): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: userData.email,
                passwordHash: await hash(userData.password, 10),
            },
        });
    }

    async createMany(usersData: {email: string; password: string}[]): Promise<User[]> {
        const users = await Promise.all(
            usersData.map(async(userData) => ({
                email: userData.email,
                passwordHash: await hash(userData.password, 10),
            }))
        );

        return Promise.all(
            users.map(userData =>
                this.prisma.user.create({data: userData})
            )
        );
    }
}