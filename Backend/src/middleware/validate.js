const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,     // Show all errors
      stripUnknown: true     // Remove unknown fields
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessages
      });
    }

    // If validation passes, continue
    next();
  };
};

export default validate;