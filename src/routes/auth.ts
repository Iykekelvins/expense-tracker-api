import { FastifyPluginAsync } from 'fastify';
import { LoginUserDto, RegisterUserDto } from '../types/auth.js';
import { loginUserSchema, registerUserSchema } from '../schemas/auth.js';

import auth from '../services/auth.js';

const authRoutes: FastifyPluginAsync = async (app) => {
	app.post<{
		Body: RegisterUserDto;
	}>(
		'/register',
		{
			schema: registerUserSchema,
		},
		async (request, reply) => {
			const user = await auth.registerUser(app.prisma, request.body);
			const token = await reply.jwtSign({
				id: user.id,
				email: user.email,
			});

			reply.status(201).send({
				message: 'User registered successfully',
				user,
				token,
			});
		},
	);

	app.post<{
		Body: LoginUserDto;
	}>('/login', { schema: loginUserSchema }, async (request, reply) => {
		const user = await auth.loginUser(app.prisma, request.body);
		const token = await reply.jwtSign({
			id: user.id,
			email: user.email,
		});

		reply.send({
			message: 'Login successful',
			user,
			token,
		});
	});
};

export default authRoutes;
