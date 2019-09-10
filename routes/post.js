const express = require('express');
const { requireSignIn } = require('../controllers/auth'); 
const {getPosts, createPost, postByUser} = require("../controllers/post");
const { createPostValidator, runValidation } = require('../validator/index');
const { userById } = require('../controllers/user'); 



const router = express.Router();

router.get('/', getPosts);
router.post('/post/new/:userId', requireSignIn, createPostValidator ,runValidation, createPost);
router.get('/posts/by/:userId', requireSignIn, postByUser)

// any route containing userId, our app will first execute userById()
router.param("userId", requireSignIn, userById);

module.exports = router;