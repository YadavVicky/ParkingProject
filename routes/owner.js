const express = require('express');
const router = express.Router();
const Parking = require('../models/parkingLot');
const catchAsync = require('../utils/catchAsync');
const Cities = require('../models/cities');
const passport = require('passport');
const { isLoggedIn } = require('../utils/isLoggedIn');
//#######################
//     owner part
//#######################

router.get('/', catchAsync(async(req, res) => { 
    const parkings = await Parking.find({})
    res.render('owner/home', { parkings });
}));

router.get('/login', (req, res)=>{
    res.render('owner/login');
});

router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/owner/login'}) ,(req, res)=>{
    console.log("From login route");
    console.log(req.user)
    res.redirect('/owner');
});

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/owner/login');
});


router.get('/new', isLoggedIn ,(req, res)=>{
    res.render('owner/new');
});

router.post('/new', catchAsync(async(req, res)=>{
    const city = new Parking(req.body.city);
    await city.save()
    res.redirect('/owner');
}));

router.get('/newparking/cities', (req, res)=>{
    res.render('user/all');
});

router.get('/:id', catchAsync(async(req, res)=>{
    const { id } = req.params;
    const parking = await Parking.findById(id);
    res.render('owner/show', { parking } )
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const parking = await Parking.findById(req.params.id);
    res.render('owner/edit', { parking });

}));

router.put('/:id', catchAsync(async(req, res)=>{
    const { id } = req.params;
    const park = await Parking.findByIdAndUpdate(id, {...req.body.city})
    res.redirect(`/owner/${park._id}`)
}));



module.exports = router;
