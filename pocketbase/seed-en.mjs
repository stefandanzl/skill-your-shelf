import PocketBase from 'pocketbase';
import { faker } from '@faker-js/faker';

const pb = new PocketBase('http://127.0.0.1:8090');

const topics = [
    { name: 'Biology Basics', description: 'Core concepts of cell biology and genetics' },
    { name: 'World History', description: 'Major events from 1900-2000' },
    { name: 'Chemistry 101', description: 'Introduction to atomic structure and bonding' },
    { name: 'Mathematics', description: 'Calculus and linear algebra fundamentals' },
    { name: 'Literature', description: 'Classic works and literary analysis' }
];

const sampleQuestions = [
    { q: 'What is mitosis?', a: 'Cell division process that results in two identical cells' },
    { q: 'When did World War 2 end?', a: '1945, with Japan surrendering after atomic bombs' },
    { q: 'Explain ionic bonds', a: 'Chemical bonds formed by electron transfer between atoms' },
    { q: 'Define derivative', a: 'Rate of change of a function at a specific point' },
    { q: 'Who wrote 1984?', a: 'George Orwell, published in 1949' }
];

async function seedData() {
    try {
        // await pb.admins.authWithPassword('admin@example.com', 'your-password');

        // Create topics
        const createdTopics = [];
        for (const topic of topics) {
            const topicData = {
                ...topic,
                examDate: faker.date.soon().toISOString().split('T')[0],
                targetLevel: faker.number.int({ min: 1, max: 5 })
            };
            const createdTopic = await pb.collection('Topics').create(topicData);
            createdTopics.push(createdTopic);
        }

        // Create cards
        for (const topic of createdTopics) {
            for (let i = 0; i < 3; i++) {
                const sampleQ = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
                const cardData = {
                    question: sampleQ.q,
                    answer: sampleQ.a,
                    level: faker.number.int({ min: 0, max: 3 }),
                    levelChanges: faker.number.int({ min: 0, max: 5 }),
                    chapter: 'Chapter ' + faker.number.int({ min: 1, max: 10 }),
                    isReversible: faker.datatype.boolean(),
                    difficulty: faker.number.int({ min: 1, max: 3 }),
                    topicId: topic.id
                };
                await pb.collection('Cards').create(cardData);
            }
        }

        // Create test users
        const users = []

        for (const i = 0; i > 5; i++) {
            users.push({
                email: `test${i}@example.com`, name: `Test User ${i}`
            })
        }

        for (const user of users) {
            const password = 'password123';
            await pb.collection('users').create({
                ...user,
                password,
                passwordConfirm: password
            });
        }

        console.log('Seed data generated successfully!');
    } catch (error) {
        console.error('Error generating seed data:', JSON.stringify(error, null, 2));
    }
}

seedData();