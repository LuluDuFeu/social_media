const express = require('express');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const expressValidator = require('express-validator');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// connection to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true})
.then(() => console.log('DB connected'));

mongoose.connection.on('error', err => {
    console.log(`Db connection error: ${err.message}`);
})

// Bringing routes
const routesPost = require('./routes/post');
const routesAuth = require('./routes/auth');
const routesUser = require('./routes/user');


/* const myOwnMiddleware = (req, res, next) => {
    console.log("middleware applied!!!");
    next();
} */

const myFileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './imagFolder')
    },
    fileName: function(req, res, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const myfileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        console.log('This file passed the security test');
        cb(null, true);
    } else {
        console.log('This file did not pass the security test');
        cb(null, false);
    }
}




// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(multer({storage: myFileStorage, fileFilter: myfileFilter}).single('image'));
app.use('/', routesPost);
app.use('/', routesAuth);
app.use('/', routesUser);
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: "You are not authorized"
        })
    }
})



const port = 8080;
app.listen(port, () => console.log(`A nodejs API is listening on port: ${port}`));