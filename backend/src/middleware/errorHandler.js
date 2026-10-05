export function errorHandler(
  error,
  req,
  res,
  next
) {
  console.error(
    error
  );

  if (
    error.code === 11000
  ) {
    return res.status(409).json({
      success: false,
      message:
        "Duplicate resource",
      error: error.keyValue,
    });
  }


  if (
    error.name ===
    "ValidationError"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Validation failed",
      errors:
        Object.values(
          error.errors
        ).map(
          (item) =>
            item.message
        ),
    });
  }


  res.status(500).json({
    success: false,
    message:
      "Internal server error",
  });
}