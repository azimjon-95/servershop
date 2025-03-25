const { body, validationResult } = require('express-validator');

const validateFactory = [
    body('name').notEmpty().withMessage('Name is required'),
    body('legalForm').isIn(['MChJ', 'AJ', 'Other']).withMessage('Invalid legal form'),
    body('address.region').notEmpty().withMessage('Region is required'),
    body('address.district').notEmpty().withMessage('District is required'),
    body('director').notEmpty().withMessage('Director name is required'),
    body('projectValue').isNumeric().withMessage('Project value must be a number'),
    body('activityType').notEmpty().withMessage('Activity type is required'),
    body('contact.phone').notEmpty().withMessage('Phone is required'),
    body('contact.email').isEmail().withMessage('Valid email is required'),
    body('employees').isInt({ min: 1 }).withMessage('Employees must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateFactory;