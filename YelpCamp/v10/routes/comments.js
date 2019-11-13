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
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect(`/campgrounds/${foundCampground._id}`);
        });
    });
});

router.get('/:comment_id/edit', (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){console.log(err); res.redirect('back')};
        res.render('comments/edit', {campground:req.params.id, comment:foundComment});
    });
    
});

router.put('/:comment_id', (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){console.log(err); res.redirect('back')};
        res.redirect(`/campgrounds/${req.params.id}`)
    });
});

router.delete('/:comment_id', (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){console.log(err); res.redirect('back')};
        res.redirect(`/campgrounds/${req.params.id}`)
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next());
    }
    res.redirect('/login');
}

module.exports = router;