# NestJS REST API

A production-ready **NestJS REST API** starter/project featuring **Prisma ORM**, **Neon PostgreSQL**, **Upstash Rate Limit**, **JWT authentication with Passport**, role-based authorization, cookie and Bearer token management, and **Swagger UI** documentation.

## ✨ Features

* 🚀 **NestJS** REST API architecture
* 🗄️ **Prisma ORM** for database access
* 🐘 **Neon PostgreSQL** as the database
* 🛡️ **JWT authentication** with Passport
* 🔑 **Bearer token** authentication
* 🍪 **Cookie-based token management**
* 👤 Public routes
* 🔐 Protected routes
* 🎭 Role-based route authorization
* ⚡ **Upstash Rate Limit** for API rate limiting
* 📚 **Swagger UI** API documentation
* 🔒 Sign in, sign up, and sign out flows
* 🧩 Modular and scalable project structure

## 🛠️ Tech Stack

| Technology                              | Purpose                   |
| --------------------------------------- | ------------------------- |
| [NestJS](https://nestjs.com/)           | Backend framework         |
| [Prisma](https://www.prisma.io/)        | ORM / database access     |
| [Neon](https://neon.tech/)              | PostgreSQL database       |
| [Upstash](https://upstash.com/)         | Rate limiting             |
| [Passport](https://www.passportjs.org/) | Authentication middleware |
| JWT                                     | Authentication tokens     |
| Swagger                                 | API documentation         |
| TypeScript                              | Programming language      |

## 📁 Project Structure

```text
src/
├── account/
│   ├── account.controller.ts
│   ├── account.service.ts
│   └── ...
├── auth/
│   ├── guards/
│   ├── strategies/
│   ├── decorators/
│   └── ...
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── ...
├── app.module.ts
└── main.ts
```

> The exact structure may evolve as the project grows.

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://..."

JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="1d"

UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

> Never commit secrets or production credentials to the repository.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Swagger UI is available at:

```text
/api-docs
```

Once the application is running, open:

```text
http://localhost:3000/api-docs
```

Swagger provides an interactive interface for exploring and testing the available API endpoints.

## 🔐 Authentication

The project uses **JWT-based authentication with Passport**.

Authentication tokens can be managed through:

* HTTP cookies
* `Authorization: Bearer <token>` headers

Example:

```http
Authorization: Bearer <jwt-token>
```

The authentication layer is designed to support both public and protected resources.

## 👤 Account Endpoints

### Sign Up

```http
POST /account/signup
```

Creates a new user account.

### Sign In

```http
POST /account/signin
```

Authenticates a user and issues the authentication token.

### Sign Out

```http
POST /account/signout
```

Signs the current user out and handles authentication cookie/token cleanup.

## 🌐 Public Routes

Public endpoints can be accessed without authentication.

Example:

```http
GET /public
```

These routes are intended for resources that do not require an authenticated user.

## 🔒 Protected Routes

Protected routes require a valid JWT.

Example:

```http
GET /protected
Authorization: Bearer <jwt-token>
```

Requests without valid authentication are rejected by the authentication guard.

## 🎭 Role-Based Authorization

Protected endpoints can additionally be restricted according to the authenticated user's role.

For example:

```text
ADMIN
USER
```

A route can require a specific role before allowing access:

```text
Authenticated user
        │
        ▼
   JWT validation
        │
        ▼
   Role validation
        │
   ┌────┴────┐
   │         │
Allowed    Denied
```

This allows the API to distinguish between authenticated users with different permissions.

## ⚡ Rate Limiting

The API integrates **Upstash Rate Limit** to help protect endpoints from excessive requests and abuse.

Rate limiting can be applied to sensitive endpoints such as:

* Sign in
* Sign up
* Password-related operations
* Public APIs
* Other high-traffic endpoints

## 🗄️ Database

The project uses **Prisma** as the ORM and **Neon PostgreSQL** as the database provider.

Typical Prisma workflow:

```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name <migration-name>

# Inspect the database
npx prisma studio
```

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## 📋 Project Progress

### ✅ Completed

* ~~Initialize NestJS REST API project~~
* ~~Configure TypeScript and project structure~~
* ~~Configure Prisma ORM~~
* ~~Connect Prisma with Neon PostgreSQL~~
* ~~Configure JWT authentication~~
* ~~Integrate Passport authentication~~
* ~~Implement Bearer token authentication~~
* ~~Implement cookie-based token management~~
* ~~Implement account signup endpoint (`/account/signup`)~~
* ~~Implement account signin endpoint (`/account/signin`)~~
* ~~Implement account signout endpoint (`/account/signout`)~~
* ~~Implement public routes~~
* ~~Implement protected routes~~
* ~~Implement role-based authorization~~
* ~~Integrate Upstash rate limiting~~
* ~~Configure Swagger UI~~
* ~~Expose API documentation at `/api-docs`~~

### 🚧 Upcoming / Future Tasks

* [ ] Add refresh token rotation
* [ ] Add email verification
* [ ] Add password reset flow
* [ ] Add account/profile management
* [ ] Add more granular permissions
* [ ] Add request/response validation improvements
* [ ] Add comprehensive unit tests
* [ ] Add comprehensive e2e tests
* [ ] Add integration tests for authentication and authorization
* [ ] Add Docker support
* [ ] Add CI/CD pipeline
* [ ] Add production logging and monitoring
* [ ] Improve API error handling
* [ ] Add API versioning
* [ ] Add health-check endpoint
* [ ] Add database seeding
* [ ] Add production deployment documentation

## 🔑 Environment Variables

| Variable                   | Description                    | Required |
| -------------------------- | ------------------------------ | -------- |
| `DATABASE_URL`             | Neon PostgreSQL connection URL | ✅        |
| `JWT_SECRET`               | Secret used to sign JWTs       | ✅        |
| `JWT_EXPIRES_IN`           | JWT expiration duration        | ✅        |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST URL         | ✅        |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token       | ✅        |

## 📌 API Overview

| Method | Endpoint           | Access        |
| ------ | ------------------ | ------------- |
| `POST` | `/account/signup`  | Public        |
| `POST` | `/account/signin`  | Public        |
| `POST` | `/account/signout` | Authenticated |
| `GET`  | `/public`          | Public        |
| `GET`  | `/protected`       | Authenticated |
| `GET`  | `/api-docs`        | Documentation |

> The endpoint list above is a high-level overview. See Swagger UI for the complete and current API specification.

## 🧭 Authentication Flow

```text
Client
  │
  ├── POST /account/signup
  │          │
  │          ▼
  │      Create User
  │
  ├── POST /account/signin
  │          │
  │          ▼
  │      Validate Credentials
  │          │
  │          ▼
  │       Create JWT
  │          │
  │       ┌──┴───┐
  │       ▼      ▼
  │    Cookie   Bearer
  │
  └── Protected Request
             │
             ▼
       Passport JWT Guard
             │
             ▼
       Validate JWT
             │
             ▼
       Check User Role
             │
        ┌────┴────┐
        ▼         ▼
      Allow     Reject
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add or update tests.
5. Commit your changes.
6. Open a pull request.

## 📄 License

This project is available under the license specified in the repository.

---

Built with ❤️ using **NestJS, Prisma, Neon, Upstash, Passport, and JWT**.
