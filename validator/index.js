const { check, validationResult } = require('express-validator');
 
exports.createPostValidator = [
    check("title","title couldn't be empty").not().isEmpty(),
    check('title',"title must be between 4 to 150 characters").isLength(
        {min:4,max:150}),
    check("body","body must be between 4 to 2000 characters").isLength(
        {min:4,max:2000}),  
    ]

exports.userSignUpValidator = [
    check("name", "Name couldn't be empty").not().isEmpty(),
    check("email", "Email must be between 4 to 32 characters").isEmail().withMessage("Email must be an email.").isLength({min:4, max:32 }),
    check("password", "Password is required").not().isEmpty().isLength({min:6, max: 64}).withMessage("Password must contain between 6 and 64 characters.").matches(/\d/).withMessage('Your password must contain a number')
]

exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({error: errors.array()[0].msg});
    }
    next();
};