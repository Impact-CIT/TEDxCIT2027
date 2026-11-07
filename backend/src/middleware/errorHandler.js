/**
 * Centralized Error Handling Middleware
 */

export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err.stack || err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  return res.status(statusCode).json({
    success: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected internal server error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
}

