const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const https = require('https');
const fs = require('fs');

let handlebars = exphbs.create({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    defaultLayout: 'main',
    extname: 'handlebars'
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({email: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect Email.'});
            }

            let hash = user.password;

            bcrypt.compare(password, hash, (err, response) => {
                if (response === true) {
                    return done(null, user._id)
                } else {
                    return done(null, false, {message: 'Incorrect Password'});
                }
            });
        });
    }
));

const port = process.env.PORT || 3000;

let app = express();

let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/baraemcake');

const sessionMiddleware = session({
    secret: 'asdpfoiuenmvawv',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: false,
    saveUninitialized: false,
    // cookie: { maxAge: 24 * 60 * 60 * 1000 }
});

app.use(sessionMiddleware);
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('views'));
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    if (!req.session.cart) {
        req.session.cart = {};
    }
    console.log('express current cart is');
    console.log(req.session.cart);
    console.log('current user is');
    console.log(req.user);
    next();
});

//Models
const User = require('./models/user');

//Define Routes

//Define APIs

app.get('/', (req, res) => {
    User.find({}, (err, userResult) => {
        if(err) throw err;

        if(userResult.length < 1){
            bcrypt.hash('password123', saltRounds, (err, hash) => {
                if(err) throw err;

                let email = 'jihochoi1123@gmail.com';
                let password = hash;
                let verified = true;

                let user = new User({
                    email,
                    password,
                    verified
                });

                user.save((err, result) => {
                    if(err) throw err;
                })
            })
        }else {
            res.render('./index', {

            })
        }
    })
});

app.listen(port, ()=>{
    console.log(`listening at ${port}`)
});