const express       = require('express'),
      Campground    = require('../models/campground'),
      Comment       = require('../models/comment')
      router        = express.Router({mergeParams: true});

router.get('/new', isLoggedIn , (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)throw err;
        res.render('comments/new', {campground: foundCampground});
    });
});

router.post('/', isLoggedIn , (req, res)=>{
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next());
    }
    res.redirect('/login');
}

module.exports = router;