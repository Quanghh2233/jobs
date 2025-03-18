const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { userValidationRules, validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', userValidationRules(), validate, registerUser);
router.post('/login', loginUser);

module.exports = router;
