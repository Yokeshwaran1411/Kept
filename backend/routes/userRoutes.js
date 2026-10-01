const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/auth/register', userController.registerUser);
router.post('/auth/login', userController.loginUser);
router.post('/auth/google', userController.googleAuth);
router.put('/users/update', userController.updateUser);

module.exports = router;
