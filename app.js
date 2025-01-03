if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const DbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const campground = require('./routes/campgrounds');
const review = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const mongoStore = require('connect-mongo');
mongoose.connect(DbUrl)
.then(()=>{
    console.log("connection open :)");
}).catch((err)=>{
console.log("connection refused!! Try Again :(");
});
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(mongoSanitize(
    {
        replaceWith:'_'
    }
));
app.use(flash());
const store = mongoStore.create({
    mongoUrl: DbUrl,
    secret: 'shipra@123',
    touchAfter: 24*60*60
})
store.on("error",function(e){
    console.log("store error",e);
});
const sessionConfig = {
    store,
    name:'session',
    secret:"this is a secret!",
    resave :false,
    saveUninitialized :true,
    cookie:{
     expires: Date.now() + 24*60*60*1000,
     httpOnly:true,
   
    }
};
app.use(helmet({
    contentSecurityPolicy:false
}));


app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    console.log(req.query);
res.locals.success = req.flash('success');
res.locals.error = req.flash('error');
res.locals.currentUser = req.user;
next();
});
app.use('/',userRoutes);
app.use('/campgrounds',campground);
app.use('/campgrounds/:id/reviews',review);
app.get('/',async (req,res)=>{
    console.log('welcome!');
})
app.use((err,req,res,next)=>{
const {message,status = 500} = err;
if(!err.message) err.message = "something went wrong";
res.status(status).render('error',{err});
})

app.listen('3000',()=>{
    console.log('listening on port 3000...');
});