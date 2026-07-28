import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, CATEGORY } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
	const hashedPassword = await bcrypt.hash('password123', 10);

	const user = await prisma.user.upsert({
		where: { email: 'jane.doe@example.com' },
		update: {},
		create: {
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
			password: hashedPassword,
		},
	});

	await prisma.expense.deleteMany({ where: { userId: user.id } });

	await prisma.expense.createMany({
		data: [
			{
				title: 'Weekly groceries',
				amount: 54.32,
				date: new Date('2026-07-21'),
				category: CATEGORY.GROCERIES,
				userId: user.id,
			},
			{
				title: 'Movie night',
				amount: 22.5,
				date: new Date('2026-07-22'),
				category: CATEGORY.LEISURE,
				userId: user.id,
			},
			{
				title: 'Wireless headphones',
				amount: 89.99,
				date: new Date('2026-07-15'),
				category: CATEGORY.ELECTRONICS,
				userId: user.id,
			},
			{
				title: 'Electricity bill',
				amount: 65.0,
				date: new Date('2026-07-10'),
				category: CATEGORY.UTILITIES,
				userId: user.id,
			},
			{
				title: 'New jacket',
				amount: 120.0,
				date: new Date('2026-06-28'),
				category: CATEGORY.CLOTHING,
				userId: user.id,
			},
		],
	});

	console.log(`Seeded user ${user.email} with 5 expenses.`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
