# Servicia Backend

SaaS Core API Platform built using NestJS, TypeScript, and PostgreSQL.

---

## Technical Stack
- **Framework**: NestJS (v11)
- **ORM**: Prisma ORM (v6)
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI (REST)
- **Authentication**: Passport JWT

---

## Project Setup

### 1. Install Dependencies
```bash
$ npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and ensure the database connection URL is defined:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/servicia_db?schema=public"
```

---

## Compile and Run the Project

```bash
# Development (watch mode)
$ npm run start:dev

# Production build
$ npm run build

# Start in production mode
$ npm run start:prod
```

---

## Database Workflow (Prisma)

This project uses Prisma ORM for database migrations and seeding. All database commands are prefixed with `db:`.

### 1. How to Create a Migration (Development)
To generate a new SQL migration script from changes made in `prisma/schema.prisma`:
```bash
$ npm run db:migrate -- --name <migration-name>
```
*Example: `npm run db:migrate -- --name add-provider-model`*

### 2. How to Run Migrations
To apply any pending migrations to your database:
```bash
$ npm run db:migrate
```

### 3. How to Deploy Migrations (Staging/Production)
To apply SQL migrations to a production database (without scanning schema changes or prompting for reset):
```bash
$ npm run db:migrate:deploy
```

### 4. How to Rollback/Reset During Development
To drop the database and recreate it applying all migrations from scratch (this will erase database contents):
```bash
$ npm run db:reset
```

### 5. How to Run Seeders
To populate your database with initial data (Roles, Permissions, and Providers):
```bash
$ npm run db:seed
```

### 6. How to Open Prisma Studio
Prisma Studio provides a graphical interface to view and edit database tables:
```bash
$ npm run db:studio
```

### 7. Helper CLI Commands
- **Check Migration Status**: `npm run db:status`
- **Format schema file**: `npm run db:format`
- **Validate schema file**: `npm run db:validate`
- **Force sync schema directly**: `npm run db:push`
