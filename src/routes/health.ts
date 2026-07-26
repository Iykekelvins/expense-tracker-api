import { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (app) => {
	app.get('/', (request, reply) => {
		reply.send({
			message: 'Expense Tracker API is running',
			date: new Date().toISOString(),
		});
	});
};

export default healthRoutes;
