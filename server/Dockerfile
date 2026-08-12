# Build Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy dependency definition files first for optimal layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy application source code
COPY . .

# Build statically linked Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/api ./cmd/api

# Production Runtime Stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy binary from build stage
COPY --from=builder /app/api .
COPY --from=builder /app/.env.example .env

EXPOSE 8080

CMD ["./api"]
