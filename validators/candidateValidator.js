const { body, validationResult } = require('express-validator');

const emailValidator = body('email')
  .isEmail()
  .withMessage('Invalid email format');

const phoneValidator = body('phone')
  .matches(/^\+?[0-9]{7,15}$/)
  .withMessage('Phone number must contain 7-15 digits, optional leading +');

const nameValidator = body('name')
  .isLength({ min: 2 })
  .withMessage('Name must be at least 2 characters');

const jobTitleValidator = body('jobTitle')
  .isLength({ min: 2 })
  .withMessage('Job title must be at least 2 characters');

const validateCandidate = [
  nameValidator,
  emailValidator,
  phoneValidator,
  jobTitleValidator,
  // collect errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400 Bad Request
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCandidate };
