import 'dotenv/config';

import app from './app.js';
const PORT = process.env.PORT!;

const start = async () => {
	try {
		await app.listen({
			port: +PORT,
		});
	} catch (error) {
		app.log.error(error);
		process.exit(1);
	}
};

start();
