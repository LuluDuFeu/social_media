const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
require('dotenv').config();
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
    try {
        const userExits = await User.find({email: req.body.email});
        if(userExits.length > 0) return res.status(403).json({
            error: "Email is already taken!"
        });
        const user = await new User(req.body);
        await user.save();
        res.status(200).json({user})
            }
    catch(err) {
        console.log(err);
    }
}

exports.signin = async (req, res) => {
    // find user based on email
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        // if err or no user
        if(err || !user) {
            return res.status(401).json({
                error: "There is no user with this username, please try again"
            })
        }

        //if user is found make sure email and password match
        // create authenticifacte method in model and use here
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }
    
    

    // generate a token with user id and secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

    // persist the token as 't ' in cookie with expiry date
    res.cookie("t", token, {expire: new Date() + 60*60*3});

    // return response with user id and secret
    const {_id, name, email} = user;
    return res.json({token, user: {_id, email, name}});
    })

    // persist the token as 't' in cookie with expiry date

    // return reponse with user and token to frontend client
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({message: "Signout success!"});
}

exports.requireSignIn = expressjwt({
    // f the token is valid, express jwt appends the verified userid
    // in an auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

