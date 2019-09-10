const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const { userById } = require('../controllers/user'); 
const { userSignUpValidator, runValidation } = require('../validator/index');

const router = express.Router();

router.post('/signup', userSignUpValidator,runValidation, signup);
router.post('/signin', signin)
// signout
router.get('/signout', signout);

// any route containing userId, our app will first execute userById()
router.param("userId", userById);

module.exports = router;