    const express        = require('express'),
      bodyParser         = require('body-parser'),
      mongoose           = require('mongoose'),
      expressSanitizer   = require('express-sanitizer'),
      methodOverride     = require('method-override'),
      passport           = require('passport'),
      LocalStrategy      = require('passport-local'),
      Comment            = require('./models/comment'),
      Campground         = require('./models/campground'),
      User               = require('./models/user'),
      seedDB             = require('./seeds'),
      app                = express();

const commentRoutes     = require('./routes/comments'),
      campgroundRoutes  = require('./routes/campgrounds'),
      indexRoutes       = require('./routes/index');

//seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
// Passport Configuration:
app.use(require('express-session')({
    secret: 'Shrek is love Shrek is life',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/', indexRoutes);

app.get('/', (req, res) =>{
    res.render('landing');
});

app.listen(3000, ()=>{
    console.log('YelpCamp Server has Started!');
});