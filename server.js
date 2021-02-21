var express = require("express");
var db = require('./DBlibrary');
var session = require('express-session');
var bodyParser = require("body-parser");
var router = require("./router");
var flash = require('connect-flash');
var md5 = require('crypto-md5');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var configure = require('./configure');

var app = express();
db.connect(function(afterConnect) {
    db.createDBIfNotExists();

});
var storage = multer.diskStorage({
    destination: function(req, file, callback) {

        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        console.log(file);
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
var upload = multer({ storage: storage }).array('userPhoto', 2);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.post('/api/photo', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(session({
    secret: 'secret cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
        /* Define custom fields for passport */
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email2, password2, done) {
        /* validate email and password */
        db.login({ email: email2, password: password2 }, done);
    }
));

passport.serializeUser(function(user, done) {
    /* Attach to the session as req.session.passport.user = { email: 'test@test.com' } */
    /* The email key will be later used in our passport.deserializeUser function */
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    db.findOne({ email: email }, done);
});

app.use(function(req, res, next) {
    req.db = db;
    res.locals.user = req.user;
    next();
});

// app.use(fileUpload());
app.set("view engine", "ejs");
app.use(express.static("public"));
bodyParser = bodyParser.urlencoded({ extended: false })

app.get("/login.html", router.controler.loginView);
app.get("/register.html", router.controler.registerView);

app.post('/login.html',
    passport.authenticate('local', {
        successRedirect: '/home.html',
        failureRedirect: '/login.html',
        failureFlash: true
    }));

passport.authenticate('local', { failureFlash: 'Invalid username or password.' });

app.get('/logout.html', function(req, res) {
    req.logout();
    res.redirect('/home.html');
});

app.post("/register.html", bodyParser, router.controler.register);
app.post("/product.html", bodyParser, router.controler.product);
app.post("/cart.html/add", bodyParser, router.controler.addToCart);
app.post("/cart.html/update", bodyParser, router.controler.EditCart);
app.post("/cart.html/delete", bodyParser, router.controler.deleteFromCart);
app.post("/edit.html", bodyParser, router.controler.editPost);
app.post("/manageusers.html/checkUpdate", bodyParser, router.controler.checkUpdate)
app.post("/account.html", bodyParser, router.controler.accountPost);
app.post("/edit_product.html", bodyParser, router.controler.addProductEdit);
app.post("/edit_product.html/update", bodyParser, router.controler.editProductUpdate);
app.post("/addproduct.html/delete", bodyParser, router.controler.addProductDelete);
app.post("/checkOut.html", bodyParser, router.controler.checkOutOrder)
app.post("/manageorders.html", bodyParser, router.controler.approve)
app.post("/register.html/image", bodyParser, router.controler.registerImg)


app.get("/home.html", router.controler.home);
app.get("/shop.html", router.controler.shop);
app.get("/edit.html", router.controler.edit);
app.get("/addproduct.html", router.controler.add_product);
app.get("/account.html", router.controler.account);
app.get("/cart.html", router.controler.cart);
app.get("/checkout.html", router.controler.checkout);
app.get("/orders.html", router.controler.orders);
app.get("/manageorders.html", router.controler.manage_orders);
app.get("/manageusers.html", router.controler.manage_users);
app.listen(configure.config.port);