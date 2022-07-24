const express=require('express');

const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');

const app = express();

// DB CONFIG
const db=require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewURLParser:true})
.then(console.log('Mongo db connected...'))
.catch(err=>console.log(err));

// BODYPARSER
app.use(express.urlencoded({extended:false}));

// SESSION
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// FLASH
app.use(flash());

// GLOBAL VARIABLE
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// ROUTES
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT=process.env.PORT||3000;

app.listen(PORT, console.log(`server started on ${PORT}`));