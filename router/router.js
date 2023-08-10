const express = require('express')
const router = express.Router();
const controller = require('../controllers/controllers')
const auth = require('../middleware/auth')
const adminController = require('../controllers/adminController')

// Route to register a new user
router.post('/register', controller.register);

// Route to login to the app
router.post('/login', controller.verifyUser, controller.login);

// Route to update the user profile
router.put('/updateuser', auth.Auth, controller.updateUser);

// Route to get user data with a specific username
router.get('/user/:username', auth.Auth, controller.getUser);


router.get('/users', adminController.users)

module.exports = router;