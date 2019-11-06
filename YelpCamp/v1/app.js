const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
    {name: 'Shrek Swamp', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQmSIoAfC-k-4hAO92syQnW16Ko9ACp-SELUaBUEOozBWSFouVM'},
    {name: 'Shrek Swamp 2', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRRPifrzwfTZQrccsv3RTeCvOWVW3pjzgqomFIQbTopPKse-fpu'},
    {name: 'Shrek Swamp 3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQu-2g7NAt2rxVKj01hxUtnzZmY9AQjq0mxe5zH8JuhnbcXp7Vx'},
]

app.get('/', (req, res) =>{
    res.render('landing');
})

app.get('/campgrounds', (req, res)=>{
    res.render('campgrounds', {campgrounds:campgrounds});
});

app.post('/campgrounds', (req, res) =>{
    // Get data from form and add to campgrounds array
    let newCampground = {name: req.body.name, image: req.body.image};
    campgrounds.push(newCampground);
    // Redirect back to campgrounds page
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) =>{
    res.render('new');
});

app.listen(3000, ()=>{
    console.log('YelpCamp Server has Started!');
})