# HabeshaMart Backend

A production-style, modular monolith e-commerce backend built with **Go** and **Gin**, adhering to clean architecture principles (**Handler → Service → Repository**).

## 🚀 Project Overview

HabeshaMart is designed to demonstrate high-performance RESTful API engineering in Go. It combines clean separation of concerns, structured logging, database ORM integration with GORM (PostgreSQL), Redis caching, JWT security, and Docker containerization while serving as a learning blueprint for Go developers.

---

## 🏗 Architecture

The backend follows a **Modular Monolith** pattern organized into clean layers:

```
[ HTTP Request ] 
       │
       ▼
 [ Middleware Layer ]  ──► (CORS, Logger, Panic Recovery, Auth JWT, Rate Limit)
       │
       ▼
  [ Handler Layer ]    ──► Parses JSON HTTP Request & Validates inputs
       │
       ▼
  [ Service Layer ]    ──► Executes Core Business Logic
       │
       ▼
 [ Repository Layer ]  ──► Handles Data Storage Access (GORM / Postgres / Redis)
```

---

## 🛠 Technology Stack

- **Language**: Go (1.22+)
- **HTTP Framework**: [Gin Gonic](https://github.com/gin-gonic/gin)
- **Primary Database**: PostgreSQL 16
- **ORM**: [GORM](https://gorm.io)
- **Cache & Queue**: Redis 7 ([go-redis/v9](https://github.com/redis/go-redis))
- **Auth**: JWT ([golang-jwt/jwt/v5](https://github.com/golang-jwt/jwt)) & `golang.org/x/crypto/bcrypt`
- **Configuration**: [godotenv](https://github.com/joho/godotenv)
- **Logging**: Go standard library `log/slog`
- **Containerization**: Docker & Docker Compose

---

## 📂 Folder Structure

```
server/
├── cmd/
│   └── api/
│       └── main.go         # Application entry point & server setup
├── internal/
│   ├── config/             # Config loader (env variables)
│   ├── database/           # GORM PostgreSQL & Redis initialization
│   ├── middleware/         # Gin middleware (CORS, Logger, Recovery, Auth)
│   ├── auth/               # Authentication route handlers
│   ├── users/              # User management route handlers
│   ├── products/           # Exemplar module (Handler->Service->Repo)
│   ├── categories/         # Category routes
│   ├── cart/               # Shopping cart routes
│   ├── orders/             # Order routes
│   ├── payments/           # Payment gateway routes
│   ├── inventory/          # Inventory management routes
│   ├── notifications/      # Notification routes
│   └── workers/            # Background job worker pool
├── pkg/
│   ├── response/           # Standard JSON response wrappers
│   ├── validator/          # Custom validation error formatters
│   └── logger/             # Structured slog wrapper
├── migrations/             # SQL schema migrations
├── tests/                  # Unit and API integration tests
├── Dockerfile              # Multi-stage production container build
├── docker-compose.yml      # Local dev stack (API + Postgres + Redis)
├── go.mod
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | HTTP Server Listener Port |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/habeshamart?sslmode=disable` | PostgreSQL Connection String |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis Connection String |
| `JWT_SECRET` | `super-secret-habeshamart-key-change-in-production` | Secret key for signing JWT tokens |
| `ENVIRONMENT` | `development` | Runtime mode (`development` or `production`) |

---

## 💻 Local Development Setup

### Prerequisites
- [Go 1.22+](https://go.dev/dl/)
- [Docker & Docker Compose](https://www.docker.com/) (optional for containerized run)
- [PostgreSQL](https://www.postgresql.org/) & [Redis](https://redis.io/) (if running locally without Docker)

### Option A: Running with Docker (Recommended)

1. Clone the repository and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Launch all services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Test the Health Check endpoint:
   ```bash
   curl http://localhost:8080/health
   ```

### Option B: Running without Docker

1. Ensure PostgreSQL and Redis are running locally.
2. Create database `habeshamart`:
   ```sql
   CREATE DATABASE habeshamart;
   ```
3. Install Go dependencies:
   ```bash
   go mod download
   ```
4. Run the Go server:
   ```bash
   go run ./cmd/api/main.go
   ```

---

## 🧪 Testing

Run all unit and integration tests:
```bash
go test -v ./...
```

Run static analysis checks:
```bash
go vet ./...
```

---

## 🔮 Next Implementation Steps

1. **User Authentication & Auth Token Workflow**: Complete `/auth/register` and `/auth/login` with bcrypt hashing and JWT generation.
2. **Categories & Inventory Integration**: Connect product categories and inventory tracking to products.
3. **Cart & Checkout**: Implement Redis-backed active carts and database order processing with GORM transactions.
4. **Payment Gateway Integration**: Webhook handlers for Stripe / Chapa / Telebirr payments.
