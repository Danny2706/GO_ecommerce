package logger

import (
	"log/slog"
	"os"
	"strings"
)

// Log is the global structured logger instance.
// Using Go's built-in `log/slog` (introduced in Go 1.21) provides standard high-performance structured logging.
var Log *slog.Logger

// InitLogger initializes the global logger based on the environment (development vs production).
// Go Concept: Package Initialization & Pointers
// Pass environment string to determine log formatting (JSON vs Human-readable Text).
func InitLogger(env string) {
	var handler slog.Handler

	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}

	if strings.ToLower(env) == "development" {
		opts.Level = slog.LevelDebug
		// Text handler produces human-readable output suitable for local terminal debugging
		handler = slog.NewTextHandler(os.Stdout, opts)
	} else {
		// JSON handler produces structured JSON logs suited for log aggregators (e.g., Datadog, ELK)
		handler = slog.NewJSONHandler(os.Stdout, opts)
	}

	Log = slog.New(handler)
	slog.SetDefault(Log)
}
