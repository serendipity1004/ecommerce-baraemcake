const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const bcrypt = require('bcrypt');
const hbs = require('handlebars');
const saltRounds = 10;
const https = require('https');
const fs = require('fs');
const flash = require('connect-flash');

//Tools import
const {fillCakeData} = require('./tools/fillCakeData');

//Routes
const shopRoute = require('./routes/shop');
const loginRoute = require('./routes/login');
const adminRoute = require('./routes/admin');

//Api Routes
const loginApi = require('./routes/api/login');
const shopApi = require('./routes/api/shop');
const adminApi = require('./routes/api/admin');

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
mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1:27017/baraemcake');

const sessionMiddleware = session({
    secret: 'asdpfoiuenmvawv',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
});

app.use(sessionMiddleware);
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static('views'));
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();

    Product.find({}, '_id name price largeImagePath overviewComments', {sort:{'order': 1}}, (err, allProducts) => {
        if (err) throw err;

        res.locals.globalSlider = true;

        if(req.url.startsWith('/shop/details') || req.url.startsWith('/shop/cart') || req.url.startsWith('/profile') || req.url.startsWith('/login') || req.url.startsWith('/admin') || req.url.endsWith('/shop/') || req.url.endsWith('/shop')){
            res.locals.globalSlider = false;
        }

        res.locals.globalAllProducts = allProducts;

        if (!req.session.cart) {
            req.session.cart = {};
        }

        let sessionCart = req.session.cart;
        let prodIds = Object.keys(sessionCart);

        if (prodIds.length > 0) {
            Product.find({_id: {$in: prodIds}}, {}, {sort:{'order':-1}}, (err, productResult) => {
                console.log(err)
                if (err) throw err;

                for (let i = 0; i < productResult.length; i++) {
                    let curProduct = productResult[i];

                    curProduct['curQuantity'] = sessionCart[curProduct._id];
                    productResult[i] = curProduct;
                }

                res.locals.cartProducts = productResult;

                next();
            });
        } else {
            res.locals.cartProducts = [];
            console.log(req.session.cart);
            next();
        }
    });
});

//Models
const User = require('./models/user');
const Product = require('./models/product');

//Define Routes
app.use('/shop', shopRoute);
app.use('/login', loginRoute);
app.use('/admin', adminRoute);

//Define APIs
app.use('/api/login', loginApi);
app.use('/api/shop', shopApi);
app.use('/api/admin', adminApi);

app.get('/', (req, res) => {
    // fillCakeData();

    Product.find({}, (err, result) => {
        if (err) throw err;

        res.render('./index', {
            slideRevolution: true,
            allProducts: result,
            newProducts: result,
            bestSellers: result,
            recommendedProducts: result,
            js: ['/index.js'],
            css: ['/index.css'],
        })
    });
});

// app.get('/admin', (req, res) => {
//     Product.find({}, (err, result) => {
//         if (err) throw err;
//
//         res.render('./admin', {
//             products: result,
//             js: ['./admin.js']
//         })
//     })
// });

app.listen(port, () => {
    console.log(`listening at ${port}`)
});

hbs.registerHelper('trueTillIndex', (targetIndex, inputIndex) => {
    return parseInt(inputIndex) > parseInt(targetIndex) ? false : true
});

hbs.registerHelper('calculateTotal', (price, quantity) => {
    return parseInt(price) * parseInt(quantity);
});

hbs.registerHelper('evenOrNot', (index) => {
    return index % 2 === 0;
});

hbs.registerHelper('newLineToHtml', (text) => {

    return text.replace(/\\n/g, '<br/>')
});

hbs.registerHelper('onlyShowTwoLines', (text) =>{
    let newArr = text.split(/\\n/g);

    if(newArr.length > 2){
        newArr.splice(2, newArr.length - 2)
    }

    return newArr.join('<br/>')
});

hbs.registerHelper('onlyShowOneLine', (text) => {
    let newArr = text.split(/\\n/g);

    if(newArr.length > 1){
        newArr.splice(1, newArr.length - 1)
    }

    return newArr.join('<br/>')
});

hbs.registerHelper('convertDelivered', (text) => {
    if(text){
        return '배송됨';
    }else{
        return '배송 준비중';
    }
});