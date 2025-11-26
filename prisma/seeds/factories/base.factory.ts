import { PrismaClient } from "src/common/generated/prisma/client";

export abstract class BaseFactory<T> {
    constructor(protected prisma: PrismaClient) { }

    abstract create(data?: any): Promise<T>;
    abstract createMany(data?: any): Promise<T[]>;
}