import { CATEGORY, PrismaClient } from '../generated/prisma/client.js';
import { ExpenseWhereInput } from '../generated/prisma/models.js';
import { CreateExpenseDto, UpdateExpenseDto } from '../types/expenses.js';
import { AppError } from '../utils/AppError.js';

export type ExpensesQuery = {
	period?: 'week' | 'month' | '3months';
	startDate?: string;
	endDate?: string;
};

const getAllExpenses = async (
	prisma: PrismaClient,
	userId: string,
	filters: ExpensesQuery,
) => {
	const where: ExpenseWhereInput = {
		userId,
	};

	if (filters.period) {
		const now = new Date();
		const start = new Date(now);

		switch (filters.period) {
			case 'week':
				start.setDate(now.getDate() - 7);
				break;
			case 'month':
				start.setMonth(now.getMonth() - 1);
				break;
			case '3months':
				start.setMonth(now.getMonth() - 3);
				break;
		}

		where.date = {
			gte: start,
			lte: now,
		};
	} else if (filters.startDate || filters.endDate) {
		where.date = {
			...(filters.startDate && { gte: new Date(filters.startDate) }),
			...(filters.endDate && { lte: new Date(filters.endDate) }),
		};
	}

	return prisma.expense.findMany({
		where,
		orderBy: {
			createdAt: 'desc',
		},
		omit: {
			userId: true,
		},
	});
};

const getExpenseById = async (prisma: PrismaClient, id: string) => {
	const expense = await prisma.expense.findUnique({ where: { id } });
	if (!expense) {
		throw new AppError('Expense not found', 404);
	}

	return expense;
};

const createExpense = async (
	prisma: PrismaClient,
	userId: string,
	data: CreateExpenseDto,
) => {
	if (!Object.values(CATEGORY).includes(data.category as CATEGORY)) {
		const validCategories = Object.values(CATEGORY)
			.map((c) => c.toLowerCase())
			.join(', ');

		throw new AppError(
			`Invalid expense category. Has to be one of ${validCategories}`,
			400,
		);
	}

	return prisma.expense.create({
		data: {
			...data,
			userId,
		},
	});
};

const updateExpense = async (
	prisma: PrismaClient,
	id: string,
	data: UpdateExpenseDto,
) => {
	const expense = await prisma.expense.findUnique({ where: { id } });
	if (!expense) {
		throw new AppError('Expense not found', 404);
	}

	if (data.category) {
		if (!Object.values(CATEGORY).includes(data.category as CATEGORY)) {
			const validCategories = Object.values(CATEGORY)
				.map((c) => c.toLowerCase())
				.join(', ');

			throw new AppError(
				`Invalid expense category. Has to be one of ${validCategories}`,
				400,
			);
		}
	}

	return prisma.expense.update({
		where: { id },
		data,
	});
};

const deleteExpense = async (prisma: PrismaClient, id: string) => {
	const expense = await prisma.expense.findUnique({ where: { id } });
	if (!expense) {
		throw new AppError('Expense not found', 404);
	}

	return prisma.expense.delete({
		where: { id },
	});
};
const authorizeExpenseOwner = async (
	prisma: PrismaClient,
	expenseId: string,
	userId: string,
) => {
	const expense = await prisma.expense.findUnique({
		where: { id: expenseId },
	});

	if (!expense) {
		throw new AppError('Expense not found', 404);
	}

	if (userId !== expense?.userId) {
		throw new AppError('Not allowed', 403);
	}
};

export default {
	getAllExpenses,
	getExpenseById,
	createExpense,
	updateExpense,
	deleteExpense,
	authorizeExpenseOwner,
};
