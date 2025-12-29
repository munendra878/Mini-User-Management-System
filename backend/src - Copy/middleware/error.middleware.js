module.exports = (err, req, res, next) => {
  // Log for server visibility
  console.error(err);

  const status = err.status || 500;
  const payload = {
    message: err.message || "Internal server error",
  };

  if (err.details) {
    payload.details = err.details;
  }

  res.status(status).json(payload);
};

