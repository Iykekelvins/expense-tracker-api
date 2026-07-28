import { FastifyPluginAsync } from 'fastify';
import { CreateExpenseDto, UpdateExpenseDto } from '../types/expenses.js';
import { createExpenseSchema, updateExpenseSchema } from '../schemas/expenses.js';
import { CATEGORY } from '../generated/prisma/enums.js';

import expenses, { ExpensesQuery } from '../services/expenses.js';

type IdParams = {
	id: string;
};

const expensesRoutes: FastifyPluginAsync = async (app) => {
	app.get<{ Querystring: ExpensesQuery }>('/', async (request, reply) => {
		await request.jwtVerify();

		const userExpenses = await expenses.getAllExpenses(
			app.prisma,
			request.user.id,
			request.query,
		);

		return {
			data: userExpenses,
		};
	});

	app.post<{
		Body: CreateExpenseDto;
	}>('/', { schema: createExpenseSchema }, async (request, reply) => {
		await request.jwtVerify();

		const newExpense = await expenses.createExpense(app.prisma, request.user.id, {
			...request.body,
			category: request.body.category.toUpperCase() as CATEGORY,
		});

		reply.status(201).send({
			message: 'Expense created successfully',
			data: {
				...newExpense,
				amount: Number(newExpense.amount),
				category: newExpense.category.toLowerCase(),
			},
		});
	});

	app.get<{
		Params: IdParams;
	}>('/:id', async (request, reply) => {
		await request.jwtVerify();
		await expenses.authorizeExpenseOwner(
			app.prisma,
			request.params.id,
			request.user.id,
		);

		const expense = await expenses.getExpenseById(app.prisma, request.params.id);

		reply.send({
			data: {
				...expense,
				amount: Number(expense.amount),
				category: expense.category.toLowerCase(),
			},
		});
	});

	app.patch<{
		Params: IdParams;
		Body: UpdateExpenseDto;
	}>('/:id', { schema: updateExpenseSchema }, async (request, reply) => {
		await request.jwtVerify();
		await expenses.authorizeExpenseOwner(
			app.prisma,
			request.params.id,
			request.user.id,
		);

		const expenseToUpdate = await expenses.updateExpense(
			app.prisma,
			request.params.id,
			request.body,
		);

		reply.send({
			message: 'Expense updated successfully',
			data: {
				...expenseToUpdate,
				amount: Number(expenseToUpdate.amount),
				category: expenseToUpdate.category.toLowerCase(),
			},
		});
	});

	app.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
		await request.jwtVerify();
		await expenses.authorizeExpenseOwner(
			app.prisma,
			request.params.id,
			request.user.id,
		);

		await expenses.deleteExpense(app.prisma, request.params.id);

		reply.status(204).send();
	});
};

export default expensesRoutes;
