import { UserFactory } from './factories/user.factory';
import { ColumnFactory } from './factories/column.factory';
import { CardFactory } from './factories/card.factory';
import { CommentFactory } from './factories/comment.factory';
import { SEED_USERS, COLUMN_TITLES, CARD_DATA, COMMENT_TEXTS } from './data/seed-data';
import { Card, Column, PrismaClient, User } from 'src/common/generated/prisma/client';

class DatabaseSeeder {
    private prisma: PrismaClient;
    private userFactory: UserFactory;
    private columnFactory: ColumnFactory;
    private cardFactory: CardFactory;
    private commentFactory: CommentFactory;

    constructor() {
        this.prisma = new PrismaClient();
        this.userFactory = new UserFactory(this.prisma);
        this.columnFactory = new ColumnFactory(this.prisma);
        this.cardFactory = new CardFactory(this.prisma);
        this.commentFactory = new CommentFactory(this.prisma);
    }

    async cleanDatabase() {
        console.log('Cleaning database...');
        await this.prisma.comment.deleteMany();
        await this.prisma.card.deleteMany();
        await this.prisma.column.deleteMany();
        await this.prisma.user.deleteMany();
    }

    async seedUsers() {
        console.log('Seeding users...');
        return this.userFactory.createMany(SEED_USERS);
    }

    async seedColumns(users: User[]) {
        console.log('Seeding columns...');

        const [user1, user2] = users;

        const user1Columns = await this.columnFactory.createForUser(
            user1.id,
            COLUMN_TITLES.user1
        );

        const user2Columns = await this.columnFactory.createForUser(
            user2.id,
            COLUMN_TITLES.user2
        );

        return {user1Columns, user2Columns};
    }

    async seedCards(users: User[], columns: {user1Columns: Column[], user2Columns: Column[]}) {
        console.log('Seeding cards...');

        const [user1, user2] = users;
        const {user1Columns, user2Columns} = columns;

        const user1Cards = (await Promise.all([
            this.cardFactory.createForColumn(user1.id, user1Columns[0].id, [CARD_DATA.user1[0]]),
            this.cardFactory.createForColumn(user1.id, user1Columns[1].id, [CARD_DATA.user1[1]]),
            this.cardFactory.createForColumn(user1.id, user1Columns[2].id, [CARD_DATA.user1[2]]),
        ])).flat();

        const user2Cards = (await Promise.all([
            this.cardFactory.createForColumn(user2.id, user2Columns[0].id, [CARD_DATA.user2[0]]),
            this.cardFactory.createForColumn(user2.id, user2Columns[1].id, [CARD_DATA.user2[1]]),
            this.cardFactory.createForColumn(user2.id, user2Columns[2].id, [CARD_DATA.user2[2]]),
        ])).flat();

        return {user1Cards, user2Cards};
    }

    async seedComments(users: User[], cards: {user1Cards: Card[], user2Cards: Card[]}) {
        console.log('Seeding comments...');

        const [user1, user2] = users;
        const {user1Cards, user2Cards} = cards;

        const commentsData = [
            {text: COMMENT_TEXTS[0], ownerId: user1.id, cardId: user1Cards[0].id},
            {text: COMMENT_TEXTS[1], ownerId: user1.id, cardId: user1Cards[1].id},
            {text: COMMENT_TEXTS[2], ownerId: user2.id, cardId: user2Cards[0].id},
            {text: COMMENT_TEXTS[3], ownerId: user2.id, cardId: user2Cards[1].id},
            {text: COMMENT_TEXTS[4], ownerId: user2.id, cardId: user2Cards[2].id},
        ];

        return this.commentFactory.createForCards(commentsData);
    }

    async run() {
        try {
            await this.cleanDatabase();

            const users = await this.seedUsers();
            const columns = await this.seedColumns(users);
            const cards = await this.seedCards(users, columns);
            const comments = await this.seedComments(users, cards);

            console.log('🟩 Database seeded successfully!');
            console.log(`Created: ${users.length} users, ${Object.values(columns).flat().length} columns, ${Object.values(cards).flat().length} cards, ${comments.length} comments`);
        } catch (error) {
            console.error('🟥Seeding failed:', error);
            throw error;
        } finally {
            await this.prisma.$disconnect();
        }
    }
}

new DatabaseSeeder()
    .run()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });