package workers

import (
	"context"
	"sync"

	"github.com/example/habeshamart/pkg/logger"
)

// Task represents an asynchronous function to execute in the worker pool.
type Task func(ctx context.Context)

// WorkerPool manages asynchronous background processing tasks using goroutines and channels.
type WorkerPool struct {
	tasks chan Task
	wg    sync.WaitGroup
}

// NewWorkerPool creates a new worker pool with specified buffer size.
func NewWorkerPool(buffer int) *WorkerPool {
	return &WorkerPool{
		tasks: make(chan Task, buffer),
	}
}

// Start launches worker goroutines that process queued tasks until context is cancelled or tasks channel is closed.
func (wp *WorkerPool) Start(ctx context.Context, concurrency int) {
	for i := 1; i <= concurrency; i++ {
		wp.wg.Add(1)
		go func(workerID int) {
			defer wp.wg.Done()
			logger.Log.Info("Starting background worker", "worker_id", workerID)
			for {
				select {
				case <-ctx.Done():
					logger.Log.Info("Stopping background worker", "worker_id", workerID)
					return
				case task, ok := <-wp.tasks:
					if !ok {
						logger.Log.Info("Worker channel closed, exiting worker", "worker_id", workerID)
						return
					}
					// Execute background task with recovery wrapper
					executeTaskSafely(ctx, workerID, task)
				}
			}
		}(i)
	}
}

// Submit enqueues an asynchronous task into the worker pool.
func (wp *WorkerPool) Submit(task Task) bool {
	select {
	case wp.tasks <- task:
		return true
	default:
		logger.Log.Warn("Worker pool queue is full, task dropped")
		return false
	}
}

// Stop closes task channel and waits for active worker tasks to complete.
func (wp *WorkerPool) Stop() {
	close(wp.tasks)
	wp.wg.Wait()
	logger.Log.Info("Worker pool gracefully stopped")
}

func executeTaskSafely(ctx context.Context, workerID int, task Task) {
	defer func() {
		if r := recover(); r != nil {
			logger.Log.Error("Worker panic recovered", "worker_id", workerID, "panic", r)
		}
	}()
	task(ctx)
}

// E-commerce helper tasks:

// SendOrderConfirmationTask returns a background task to simulate async email notification sending.
func SendOrderConfirmationTask(orderID uint, userEmail string) Task {
	return func(ctx context.Context) {
		logger.Log.Info("Sending order confirmation email asynchronously", "order_id", orderID, "email", userEmail)
		// Async email logic simulated
	}
}

// SendPaymentReceiptTask returns a background task for processing payment receipts.
func SendPaymentReceiptTask(orderID uint, transactionID string) Task {
	return func(ctx context.Context) {
		logger.Log.Info("Processing payment receipt asynchronously", "order_id", orderID, "txn_id", transactionID)
		// Async receipt logic simulated
	}
}
