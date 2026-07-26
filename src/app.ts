import Fastify from 'fastify';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import fastifyJwt from '@fastify/jwt';
import prismaPlugin from './plugins/prisma.js';
import expensesRoutes from './routes/expenses.js';
import { errorHandler } from './utils/error.js';

const app = Fastify({ logger: true });

app.register(prismaPlugin);
app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET!,
});
app.register(healthRoutes);
app.register(authRoutes, {
	prefix: '/api/auth',
});
app.register(expensesRoutes, {
	prefix: '/api/expenses',
});
app.setErrorHandler(errorHandler);

export default app;
