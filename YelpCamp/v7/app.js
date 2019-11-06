const express            = require('express'),
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
// ROUTES: 

app.get('/', (req, res) =>{
    res.render('landing');
});

app.get('/campgrounds', (req, res)=>{
    Campground.find({}, (err, campgrounds)=>{
        if (err) throw err;
        res.render('campgrounds/index', {campgrounds:campgrounds});
    })
});

app.post('/campgrounds', (req, res) =>{
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }, (err)=> { if (err) throw err});
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
        if(err)throw err;
        res.render('campgrounds/show', {campground:foundCampground});
    });
});


// Comment routes

app.get('/campgrounds/:id/comments/new', isLoggedIn , (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)throw err;
        res.render('comments/new', {campground: foundCampground});
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn , (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){console.log(err); res.redirect('/campgrounds')}
        Comment.create(req.body.comment, (err, comment)=>{
            if(err)throw err;
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect(`/campgrounds/${foundCampground._id}`);
        });
    });
});
// Auth Routes
// Show register form
app.get('/register', (req, res)=>{
    res.render('register');
});
// Register logic
app.post('/register', (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, newUser)=>{
        if(err){console.log(err); return res.render('register')};
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/campgrounds');
        });
    });
});
// Login
app.get('/login', (req, res)=>{
    res.render('login');
})
// Login logic
app.post('/login', passport.authenticate('local', {
     successRedirect: '/campgrounds',
     failureRedirect: '/login'
    }) , (req, res)=>{
});
// Logout
app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next());
    }
    res.redirect('/login');
}

app.listen(3000, ()=>{
    console.log('YelpCamp Server has Started!');
})