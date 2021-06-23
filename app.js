const express = require('express');          
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');


// Models
const userLog = require('./models/userlog');
const check = require('./models/check')
const Cities = require('./models/cities');
const ownerLog = require('./models/ownerLog');
const carDetails = require('./models/parkingLot');



//routes
const generalroutes = require('./routes/general');
const ownerroutes = require('./routes/owner');
const userroutes = require('./routes/user');

//mongodb code
mongoose.connect('mongodb+srv://myParking:2QZXG7JuJyKLb8CM@myparking.fjy4n.mongodb.net/myParking?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


//mongo db atlas db access password: 2QZXG7JuJyKLb8CM 

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'));
db.once("open",()=>{
    console.log("Database connected");
})

//session configuration
const sessionconfig = {
    secret: 'helloworld',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date().now + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize())


passport.use(new LocalStrategy(userLog.authenticate()));

passport.serializeUser(userLog.serializeUser());
passport.deserializeUser(userLog.deserializeUser());

app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');  
    res.locals.error = req.flash('error');
    next();
});

app.use(generalroutes);
app.use(userroutes);
app.use('/owner',ownerroutes);

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render('error', { err });
    // res.redirect('back')
});


//######################
//        Server
//######################
const port = process.env.PORT

app.listen(port, ()=>{
    console.log("Serving on port 3000");
})
