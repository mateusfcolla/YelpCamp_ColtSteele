const express            = require('express'),
      bodyParser         = require('body-parser'),
      mongoose           = require('mongoose'),
      expressSanitizer   = require('express-sanitizer'),
      methodOverride     = require('method-override'),
      Comment            = require('./models/comment'),
      Campground         = require('./models/campground'),
      seedDB             = require('./seeds'),
      app                = express();

// seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

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

app.get('/campgrounds/:id/comments/new', (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)throw err;
        res.render('comments/new', {campground: foundCampground});
    });
});

app.post('/campgrounds/:id/comments', (req, res)=>{
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

app.listen(3000, ()=>{
    console.log('YelpCamp Server has Started!');
})