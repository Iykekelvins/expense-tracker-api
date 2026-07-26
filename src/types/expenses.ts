import { CATEGORY } from '../generated/prisma/enums.js';

export interface CreateExpenseDto {
	title: string;
	amount: number;
	date: string;
	category: CATEGORY;
}

export interface UpdateExpenseDto {
	title?: string;
	amount?: number;
	date?: string;
	category?: CATEGORY;
}
