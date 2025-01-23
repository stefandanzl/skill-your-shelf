import PocketBase from 'pocketbase';
import { faker } from '@faker-js/faker';

const pb = new PocketBase('http://127.0.0.1:8090');

async function seedData() {
    try {
        // Admin login
        // await pb.admins.authWithPassword('admin@example.com', 'your-password');

        // Create topics
        const topics = [];
        for (let i = 0; i < 5; i++) {
            const topicData = {
                name: faker.lorem.words(2),
                description: faker.lorem.paragraph(),
                examDate: faker.date.future().toISOString().split('T')[0],
                targetLevel: faker.number.int({ min: 1, max: 5 })
            };
            const topic = await pb.collection('Topics').create(topicData);
            topics.push(topic);
        }

        // Create cards for each topic
        for (const topic of topics) {
            const numCards = faker.number.int({ min: 5, max: 15 });
            for (let i = 0; i < numCards; i++) {
                const cardData = {
                    question: faker.lorem.sentence() + '?',
                    answer: faker.lorem.paragraph(),
                    level: faker.number.int({ min: 0, max: 5 }),
                    levelChanges: faker.number.int({ min: 0, max: 10 }),
                    chapter: faker.lorem.word(),
                    isReversible: faker.datatype.boolean(),
                    difficulty: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
                    topic: topic.id
                };
                await pb.collection('Cards').create(cardData);
            }
        }

        // Create test users
        for (let i = 0; i < 3; i++) {
            const password = faker.internet.password();
            const userData = {
                email: faker.internet.email(),
                password: password,
                passwordConfirm: password,
                name: faker.person.fullName()
            };
            await pb.collection('users').create(userData);
        }

        console.log('Seed data generated successfully!');
    } catch (error) {
        console.error('Error generating seed data:', error);
    }
}

seedData();