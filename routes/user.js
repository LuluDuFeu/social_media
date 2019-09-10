const express = require('express');
const { requireSignIn } = require('../controllers/auth'); 
const { userById, allUsers, getUser, updateUser, deleteUser, hasAuthorization } = require('../controllers/user'); 


const router = express.Router();

// signout
router.get('/users', allUsers);
router.get('/user/:userId',requireSignIn, getUser);
router.put('/user/:userId',requireSignIn, updateUser);
router.delete('/user/:userId',requireSignIn, deleteUser);


// any route containing userId, our app will first execute userById()
router.param("userId", userById);

module.exports = router;