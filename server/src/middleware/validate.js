export function validate(schema) {
  return (req, res, next) => {
    const toValidate = ['params', 'query', 'body'].reduce((acc, key) => {
      if (schema[key]) acc[key] = req[key];
      return acc;
    }, {});
    const { error, value } = schema.schema.validate(toValidate, { abortEarly: false, allowUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, error: error.details.map(d => d.message).join(', ') });
    }
    Object.assign(req, value);
    return next();
  };
}
