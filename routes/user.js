const express = require('express');
const router = express.Router();
const Cities = require('../models/cities');
const passport = require('passport')
const userLog = require('../models/userlog');
const ownerLog = require('../models/ownerLog');
const catchAsync = require('../utils/catchAsync');
const parkingLot = require('../models/parkingLot');
const Joi = require('joi');
const { parkingLotSchema }  = require('../utils/schemas');
const { maplocation }  = require('../utils/schemas');
const ExpressError = require('../utils/ExpressError');
const moment = require('moment');
const { isLoggedIn } = require('../utils/isLoggedIn');


const validateParking = (req, res, next) => {
    const { VNumber, slot } = req.body
    const { error } = parkingLotSchema.validate({'vehicle': VNumber})
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

const validatemap = (req, res, next) => {
    const { location } = req.query
    const { error } = maplocation.validate({'location': location})
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}


//#######################
//      user part 
//#######################


router.get('/city', catchAsync(async (req, res) => { 
    const cities = await Cities.find({})
    res.render('user/all',{ cities, aeza });
}));

router.get('/city/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const city = await Cities.findById(id);
    res.render('user/show', { city });
}));

router.get('/map',validatemap, catchAsync( async (req, res)=>{
    if(Object.keys(req.query).length === 1){
        const a = new Date()
        const g = new Date(a)
        y = String(g.getFullYear())
        m = ("0" + String(g.getMonth()+1)).slice(-2)
        d = ("0" + String(g.getDate())).slice(-2)
        h = ("0" + String(g.getHours())).slice(-2)
        mi =("0" + String(g.getMinutes())).slice(-2)
        J = [h,mi]
        K = [String(Number(J[0])+1), J[1]]
        q = y + "-" + m + "-" + d
        h = q
    }else{
        q  = req.query['Date1']
        h = req.query['Date2']
        J = [req.query['hr1'],req.query['min1']]
        K = [req.query['hr2'],req.query['min2']]
    }
    slota = []
    timeI = []
    timeO = []
    checking = []
    var n = q + " " + J[0] + ":" + J[1] + ":00" + " " + "GMT+05:30";
    var k = h + " " + K[0] + ":" + K[1] + ":00" + " " + "GMT+05:30";
    n = Date.parse(n) //time-in
    k = Date.parse(k) //time-out
    var { location } = req.query;
    location = location.charAt(0).toUpperCase() + location.slice(1)
    var l = req.query['location']
    l = l.charAt(0).toUpperCase() + l.slice(1)
    const city = await Cities.find({'name': location}).populate('ownerList')
    const da = city[0]['ownerList']
    for(let a of da){
        var uu = a['carDetails']
        count = 0
        for(let b of uu){
            const found = await parkingLot.findById(b)
            if(found['timeIn'] <= n && found['timeOut'] >= n){
                if(!checking.includes(found['slot'])){
                    checking.push(found['slot']);
                    count++;
                }
            }else{
                if(found['timeIn'] <= k && found['timeOut'] >= k){
                    if(!checking.includes(found['slot'])){
                        checking.push(found['slot']);
                        count++;
                    }
                }else{
                    if(n <= found['timeIn'] && k >= found['timeIn']){
                        if(!checking.includes(found['slot'])){
                            checking.push(found['slot']);
                            count++
                        }
                    }else{
                        if(n <= found['timeOut'] && k >= found['timeOut']){
                            if(!checking.includes(found['slot'])){
                                checking.push(found['slot']);
                                count++;
                            }
                        }
                    }
                }
            }
            }
        slota.push(count)
    }
    res.render('user/map', { city, q, h, K, J, l, slota})
}));

router.get('/booking/:id', isLoggedIn, catchAsync ( async (req, res)=>{
    const { id } = req.params;
    const { G } = req.query;
    slota = []
    license = []
    const foundO = await ownerLog.findById(id).populate('carDetails');
    details = foundO['carDetails']
    var l = G['date1'] + " " + G['hr1'] + ":" + G['min1'] + ":00" + " " + "GMT+05:30";
    var k = G['date2'] + " " + G['hr2'] + ":" + G['min2'] + ":00" + " " + "GMT+05:30";
    l = Date.parse(l) //time-in
    k = Date.parse(k) //time-out
    for(var j = 0; j < details.length; j++){
        if(details[j]['timeIn'] <= l && details[j]['timeOut'] >= l){
            license.push(details[j]['vehicle'])
            if(!slota.includes(details[j]['slot'])){
                slota.push(details[j]['slot']);
            }
        }else{
            if(details[j]['timeIn'] <= k && details[j]['timeOut'] >= k){
                license.push(details[j]['vehicle'])
                if(!slota.includes(details[j]['slot'])){
                slota.push(details[j]['slot']);
                }
            }else{
                if(l <= details[j]['timeIn'] && k >= details[j]['timeIn']){
                    license.push(details[j]['vehicle'])
                    if(!slota.includes(details[j]['slot'])){
                    slota.push(details[j]['slot']);
                    }
                }else{
                    if(l <= details[j]['timeOut'] && k >= details[j]['timeOut']){
                        license.push(details[j]['vehicle'])
                        if(!slota.includes(details[j]['slot'])){
                        slota.push(details[j]['slot']);
                        }
                    }
                }
            }
        }
    }
    a = G['date1'] + "at" + G['hr1'] + ":" + G['min1']
    b = G['date2'] + "at" + G['hr2'] + ":" + G['min2']
    res.render("user/book", { G, a, b, foundO, slota, license});
}));

router.post('/booking/:id', isLoggedIn, validateParking ,catchAsync ( async (req, res)=>{
    const d = new Date().getTime()
    const CId = req.user['_id'];
    const OId = req.params['id'];
    const { VNumber, timeIn, timeOut, slot } = req.body;
    const A = timeIn.split('at')
    const B = timeOut.split('at')
    var l = A[0] + " " + A[1] + ":00" + " " + "GMT+05:30";
    var k = B[0] + " " + B[1] + ":00" + " " + "GMT+05:30";
    l = Date.parse(l) //time-in 
    k = Date.parse(k) //time-out
    const newEntry = new parkingLot({'owner': OId, 'customer': CId, 'vehicle': VNumber,'dob': d ,'timeIn': l, 'timeOut': k, 'slot': slot });
    await newEntry.save();
    const owner = await ownerLog.findById(OId);
    owner.carDetails.push(newEntry);
    await owner.save();
    const user = await userLog.findById(CId);
    user.carDetails.push(newEntry);
    await user.save();
    res.render('user/all')
})); 

router.get('/profile/:id',isLoggedIn ,catchAsync(async(req, res)=>{
    // const b = moment(1624287510575).format('Do MMMM YYYY, h:mm:ss a')
    UDT = []
    const { id } = req.params
    const cust = await userLog.findById(id).populate('carDetails');
    const details = cust['carDetails']
    L = []
    O = []
    for(let a of details){
        L.push(a['dob'])
    }
    I = []
    L.reverse()
    for(let l of L){
        var g = await parkingLot.find({'dob': l});
        var a = moment(g[0]['dob']).format('Do MMMM YYYY, h:mm:ss a');
        var b = moment(g[0]['timeIn']).format('Do MMMM YYYY, h:mm:ss a');
        var c = moment(g[0]['timeOut']).format('Do MMMM YYYY, h:mm:ss a');
        var o = g[0]['owner']
        var aaa = await ownerLog.findById(o)
        O.push([aaa['parkingname'],aaa['address'],g[0]['slot'],g[0]['vehicle'],g[0]['_id'], g[0]['owner'],g[0]['timeIn'],g[0]['timeOut']])
        a = a.split(",")
        b = b.split(",")
        c = c.split(",")
        UDT.push([a[0],a[1],b[0],b[1],c[0],c[1]])
    }
    res.render('user/profile',{ details, UDT, O })
}));

router.delete('/booking/:id', isLoggedIn ,catchAsync(async(req, res)=>{
    const { Uid, Oid } = req.body
    const { id } = req.params
    await parkingLot.findByIdAndDelete(id)
    var O = await ownerLog.findById(Oid)
    var U = await userLog.findById(Uid)
    const D = O['carDetails']
    const L = U['carDetails']
    for(var d = 0; d < D.length; d++){
        if(String(D[d]) === String(id)){
           D.splice(d,1)
           break;
        }
    }
    for(var l = 0; l < L.length; l++){
        if(String(L[l]) === String(id)){
           L.splice(l,1)
           break;
        }
    }
    await ownerLog.findByIdAndUpdate(Oid, {'carDetails': D})
    await userLog.findByIdAndUpdate(Uid, {'carDetails': L})
    res.redirect(`/profile/${Uid}`)
}))

router.get('/login', (req, res)=>{
    res.render('login');
});

router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}) ,(req, res)=>{
    res.redirect('/');
})

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

router.get('/signup', (req, res)=>{
    res.render('signup');
});


router.post('/signup', catchAsync(async (req, res, next)=>{
    try {
    const { name, phone,username, password } = req.body;
    const User = new userLog({name, phone, username});
    const newUser = await userLog.register(User, password);
    req.login(newUser, err =>{
        if(err) return next(err);
        res.redirect('/')
    })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('signup')
    }
}));

module.exports = router;
