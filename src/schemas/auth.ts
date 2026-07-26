import { FastifySchema } from 'fastify';

export const registerUserSchema: FastifySchema = {
	body: {
		type: 'object',
		additionalProperties: false,
		required: ['name', 'email', 'password'],
		properties: {
			name: {
				type: 'string',
				minLength: 2,
			},
			email: {
				type: 'string',
				format: 'email',
			},
			password: {
				type: 'string',
				minLength: 6,
			},
		},
	},
};

export const loginUserSchema: FastifySchema = {
	body: {
		type: 'object',
		additionalProperties: false,
		properties: {
			email: {
				type: 'string',
				format: 'email',
			},
			password: {
				type: 'string',
				minLength: 6,
			},
		},
	},
};
