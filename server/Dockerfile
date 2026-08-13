# =========================
# Build Stage
# =========================
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy dependency files first for better layer caching
COPY go.mod go.sum ./

# Download Go dependencies
RUN go mod download

# Copy application source
COPY . .

# Build production binary
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-w -s" \
    -o /app/api \
    ./cmd/api


# =========================
# Production Stage
# =========================
FROM alpine:3.20

# HTTPS certificates + timezone data
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy compiled binary
COPY --from=builder /app/api .

EXPOSE 8080

CMD ["./api"]