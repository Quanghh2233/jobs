
const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ]
}

const postValidationRules = () => {
    return [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('content').not().isEmpty().withMessage('Content is required')
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }))
    });
}

module.exports = {
    userValidationRules,
    postValidationRules,
    validate,
};