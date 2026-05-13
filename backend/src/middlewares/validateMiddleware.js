/**
 * validate(schema) — Zod validation middleware.
 * Validates req.body / req.query / req.params against the provided schema
 * and returns a structured 400 response on failure.
 */
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.errors.map((err) => ({
          field: err.path.slice(1).join("."), // strip leading "body"/"query"/"params"
          message: err.message,
        })),
      });
    }

    req.validatedData = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;