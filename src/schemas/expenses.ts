import { FastifySchema } from 'fastify';

export const createExpenseSchema: FastifySchema = {
	body: {
		type: 'object',
		additionalProperties: false,
		required: ['title', 'amount', 'category', 'date'],
		properties: {
			title: {
				type: 'string',
				minLength: 2,
				maxLength: 255,
			},
			amount: {
				type: 'number',
			},
			category: {
				type: 'string',
			},
			date: {
				type: 'string',
				format: 'date-time',
			},
		},
	},
};

export const updateExpenseSchema: FastifySchema = {
	body: {
		type: 'object',
		additionalProperties: false,
		properties: {
			title: {
				type: 'string',
				minLength: 2,
				maxLength: 255,
			},
			amount: {
				type: 'number',
			},
			category: {
				type: 'string',
			},
			date: {
				type: 'string',
				format: 'date-time',
			},
		},
	},
};
