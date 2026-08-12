package workers

import (
	"context"

	"github.com/example/habeshamart/pkg/logger"
)

// WorkerPool manages background processing tasks.
// Go Concept: Goroutines & Channels for background async task processing.
type WorkerPool struct {
	tasks chan func(ctx context.Context)
}

// NewWorkerPool creates a new worker pool with specified buffer size.
func NewWorkerPool(buffer int) *WorkerPool {
	return &WorkerPool{
		tasks: make(chan func(ctx context.Context), buffer),
	}
}

// Start launches worker goroutines.
func (wp *WorkerPool) Start(ctx context.Context, concurrency int) {
	for i := 0; i < concurrency; i++ {
		go func(workerID int) {
			logger.Log.Info("Starting background worker", "worker_id", workerID)
			for {
				select {
				case <-ctx.Done():
					logger.Log.Info("Stopping worker", "worker_id", workerID)
					return
				case task, ok := <-wp.tasks:
					if !ok {
						return
					}
					task(ctx)
				}
			}
		}(i)
	}
}

// Submit enqueues a task into the worker pool.
func (wp *WorkerPool) Submit(task func(ctx context.Context)) {
	wp.tasks <- task
}
