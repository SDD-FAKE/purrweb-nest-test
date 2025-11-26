export const SEED_USERS = [
    {
        email: 'user1@example.com',
        password: '123456',
    },
    {
        email: 'user2@example.com',
        password: '123456',
    },
];

export const COLUMN_TITLES = {
    user1: ['Backlog', 'In Progress', 'Done'],
    user2: ['Ideas', 'Doing', 'Completed'],
};

export const CARD_DATA = {
    user1: [
        {
            title: 'Create project',
            description: 'Initialize new NestJS project'
        },
        {
            title: 'Set up database',
            description: 'Connect Prisma and PostgreSQL'
        },
        {
            title: 'Deploy application',
            description: 'Deploy app to server'
        }
    ],
    user2: [
        {
            title: 'Prepare specification',
            description: 'Formulate project requirements'
        },
        {
            title: 'Implement API',
            description: 'Create CRUD for main entities'
        },
        {
            title: 'Write tests',
            description: 'Write e2e and unit tests'
        }
    ]
};

export const COMMENT_TEXTS = [
    'Great task to start with!',
    'Don\'t forget about migrations',
    'Good start!',
    'We need to think about validation',
    'Don\'t forget to cover all critical parts with tests'
];