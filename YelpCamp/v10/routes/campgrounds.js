const express       = require('express'),
      Campground    = require('../models/campground'),
      router        = express.Router();

router.get('/', (req, res)=>{
    Campground.find({}, (err, campgrounds)=>{
        if (err) throw err;
        res.render('campgrounds/index', {campgrounds:campgrounds});
    })
});

router.post('/', isLoggedIn , (req, res) =>{
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: author
    }, (err)=> { if (err) throw err});
    res.redirect('/campgrounds');
});

router.get('/new', isLoggedIn , (req, res) =>{
    res.render('campgrounds/new');
});

router.get('/:id', (req, res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground)=>{
        if(err)throw err;
        res.render('campgrounds/show', {campground:foundCampground});
    });
});

// Edit campground route
router.get('/:id/edit', checkCampgroundOwnership , (req, res)=>{
    // Is user logged in and own the campground
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){console.log(err); res.redirect('back')}
            res.render('campgrounds/edit', {campground: foundCampground});
        });

});
// Update campground route
router.put('/:id', checkCampgroundOwnership, (req, res)=>{
    //Find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){console.log(err);res.redirect('/campgrounds')}
        res.redirect(`/campgrounds/${req.params.id}`);
    });
    //Redirect somewhere
});
// Destroy campground route
router.delete('/:id', checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){console.log(err);res.redirect('/campgrounds')}
    });
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next());
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground)=>{
            if(err){console.log(err); res.redirect('back')}
            if(foundCampground.author.id.equals(req.user._id)){
                next()
            }
            else{
                res.redirect('back');
            }
        });
    }
    else{
        res.redirect('back');
    }
}

module.exports = router;