// Its purpose is to teach TypeScript about our custom Fastify properties.
import { PrismaClient } from '../generated/prisma/client.ts';
import '@fastify/jwt';

declare module 'fastify' {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: {
			id: string;
			email: string;
		};
	}
}
