exports.validate = schema => (req, res, next) => {
  try {
    const result = schema.saveParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.issues.map(i => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    }

    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;

    return next();
  } catch (e) {
    return next(e);
  }
};
