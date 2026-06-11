export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      const error = new Error("Invalid request schema");
      error.status = 400;
      error.details = result.error.flatten();
      return next(error);
    }

    req.validated = result.data;
    next();
  };
}
