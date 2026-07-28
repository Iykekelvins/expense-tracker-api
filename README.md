# Expense Tracker API

A lightweight modern API for tracking expenses, built with Fastify, Prisma, and PostgreSQL.

## Tech Stack

- [Fastify](https://fastify.dev/) — web framework
- [Prisma ORM](https://www.prisma.io/) — database access (PostgreSQL)
- [@fastify/jwt](https://github.com/fastify/fastify-jwt) — authentication
- TypeScript

## Getting Started

### Prerequisites

- Node.js
- A PostgreSQL database

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with:

   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
   JWT_SECRET="your-secret-key"
   ```

3. Run database migrations and generate the Prisma client:

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

4. (Optional) Seed the database:

   ```bash
   npm run seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the API with hot reload        |
| `npm run start`         | Start the API                        |
| `npm run seed`          | Seed the database                    |
| `npm run prisma:migrate`| Run Prisma migrations                |
| `npm run prisma:generate`| Generate the Prisma client          |
| `npm run prisma:studio` | Open Prisma Studio                   |

## API Overview

All expense routes require a `Bearer` JWT obtained from `/api/auth/login` or `/api/auth/register`.

### Auth — `/api/auth`

| Method | Endpoint    | Description         |
| ------ | ----------- | -------------------- |
| POST   | `/register` | Register a new user  |
| POST   | `/login`    | Log in and get a JWT |

### Expenses — `/api/expenses`

| Method | Endpoint | Description                                            |
| ------ | -------- | -------------------------------------------------------- |
| GET    | `/`      | List the current user's expenses (supports filters below) |
| POST   | `/`      | Create an expense                                       |
| GET    | `/:id`   | Get a single expense                                     |
| PATCH  | `/:id`   | Update an expense                                        |
| DELETE | `/:id`   | Delete an expense                                        |

#### Query filters for `GET /api/expenses`

| Param       | Type                            | Description                                  |
| ----------- | -------------------------------- | --------------------------------------------- |
| `period`    | `week` \| `month` \| `3months`   | Filter expenses within a relative time range   |
| `startDate` | ISO date string                  | Filter expenses on/after this date            |
| `endDate`   | ISO date string                  | Filter expenses on/before this date           |

### Expense categories

`GROCERIES`, `LEISURE`, `ELECTRONICS`, `UTILITIES`, `CLOTHING`, `HEALTH`, `OTHERS`

### Health check

`GET /` — returns API status.
