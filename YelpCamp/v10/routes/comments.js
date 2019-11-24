const express       = require('express'),
      Campground    = require('../models/campground'),
      Comment       = require('../models/comment'),
      middleware    = require('../middleware'),
      router        = express.Router({mergeParams: true});

router.get('/new', middleware.isLoggedIn , (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)throw err;
        res.render('comments/new', {campground: foundCampground});
    });
});

router.post('/', middleware.isLoggedIn , (req, res)=>{
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

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){console.log(err); res.redirect('back')};
        res.render('comments/edit', {campground:req.params.id, comment:foundComment});
    });
    
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){console.log(err); res.redirect('back')};
        res.redirect(`/campgrounds/${req.params.id}`)
    });
});

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){console.log(err); res.redirect('back')};
        res.redirect(`/campgrounds/${req.params.id}`)
    })
});

module.exports = router;