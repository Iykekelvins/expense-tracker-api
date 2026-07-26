import { PrismaClient } from '../generated/prisma/client.js';
import { LoginUserDto, RegisterUserDto } from '../types/auth.js';
import { AppError } from '../utils/AppError.js';

import bcrypt from 'bcryptjs';

const registerUser = async (prisma: PrismaClient, data: RegisterUserDto) => {
	const { name, email, password } = data;

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (user) {
		throw new AppError('Failed to register', 400);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	return prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
		omit: { password: true },
	});
};

const loginUser = async (prisma: PrismaClient, data: LoginUserDto) => {
	const { email, password } = data;

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError('Invalid credentials', 400);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new AppError('Invalid credentials', 401);
	}

	const { password: pw, ...rest } = user;

	return rest;
};

export default {
	registerUser,
	loginUser,
};
