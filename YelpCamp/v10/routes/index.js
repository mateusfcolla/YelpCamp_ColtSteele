const express       = require('express'),
      passport      = require('passport'),
      User          = require('../models/user'),
      router        = express.Router();

// Show register form
router.get('/register', (req, res)=>{
    res.render('register');
});
// Register logic
router.post('/register', (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, newUser)=>{
        if(err){console.log(err); return res.render('register')};
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/campgrounds');
        });
    });
});
// Login
router.get('/login', (req, res)=>{
    res.render('login');
})
// Login logic
router.post('/login', passport.authenticate('local', {
     successRedirect: '/campgrounds',
     failureRedirect: '/login'
    }) , (req, res)=>{
});
// Logout
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('back');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return(next());
    }
    res.redirect('/login');
}

module.exports = router;