const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const parkingLot = require('../models/parkingLot');
const ownerLog = require('../models/ownerLog');
const moment = require('moment');

router.get('/', (req,res)=>{
    res.render('user/main');
});

//offline parking
router.get('/check/:id/admin', catchAsync(async (req, res) => { 
    const { id } = req.params;
    const owner = await ownerLog.findById(id)
    res.render('check', {message: null, nota: null, name: owner['parkingname'], id: id});
    }));

router.get('/check/:id/admin/check', catchAsync(async (req, res) => { 
    const { id } = req.params;
    const { vNumber, name} = req.query
    const found = await parkingLot.find({'vehicle': vNumber})
    const a = new Date()
    const g = new Date(a).getTime()
    if(found[0]){
        if(g <= found[0]['timeIn']){
        res.render('check', {message: "Found this Out", nota: null ,timeIn: found[0]['timeIn'], name: name,number: vNumber, id: id});
        }else{
            res.render('check', {message: "Time Expired!!!", nota: null ,timeIn: found[0]['timeIn'], name: name, number: vNumber, id: id});
        }
    }else{
        res.render('check', {message: null, nota: "Couldn't Find This!!!", number: vNumber, name: name, timeIn: null, id: id});
    }
    }));

//60c4d0abe3fc7403a73a8583
// /check/60c4d0abe3fc7403a73a8583/admin/check
    
router.get('/check/:id/admin/offlinebooking', catchAsync(async (req, res) => {
        const { id } = req.params; 
        const { vNumber, name } = req.query
        const a = new Date()
        var g = new Date(a)
        y = String(g.getFullYear())
        m = ("0" + String(g.getMonth()+1)).slice(-2)
        d = ("0" + String(g.getDate())).slice(-2)
        hr = g.getHours()
        mi = g.getMinutes()
        if(0 <= mi && mi <= 15){
            mi = "15"
        }else{
            if(15 < mi && mi <= 30){
                mi = "30"
            }else{
                if(30 < mi && mi <= 45 ){
                    mi = "45"
                }else{
                    if(45 < mi && mi <= 59){
                        hr += 1
                        mi = "00"
                    }
                }
            }
        }
        q = y + "-" + m + "-" + d
        hr = ("0" + String(hr)).slice(-2)
        var n = q + " " + hr + ":" + mi + ":00" + " " + "GMT+05:30";
        n = Date.parse(n)
        res.render('offline', { vNumber, name, n, id })
}));

router.get('/check/:id/admin/offline', catchAsync(async (req, res) => { 
    const { id } = req.params
    const {name, vNumber, timeIn, duration} = req.query
    timeOut = Number(timeIn) + (3600000*Number(duration))
    const foundO = await ownerLog.findById(id).populate('carDetails');
    slota = []
    details = foundO['carDetails']
    l = timeIn //time-in
    k = timeOut //time-out
    for(var j = 0; j < details.length; j++){
        if(details[j]['timeIn'] <= l && details[j]['timeOut'] >= l){
            slota.push(details[j]['slot']);
        }else{
            if(details[j]['timeIn'] <= k && details[j]['timeOut'] >= k){
                slota.push(details[j]['slot']);
            }
        }
    }
    if(slota.length == 12){
        res.render("confirm", {t: 0, c: null ,id})
    }else{
    t = 1
    while(t == 1){
        c = Math.floor(Math.random() * 12) + 1;
        t = 0
        for(let s of slota){
            if(s == c){
                t = 1
                break
            }
        }
    }
    res.render("confirm", {t: 1, c, id, l, k, vNumber})
    }   
}));

router.post('/check/:id/admin/offline', catchAsync(async (req, res) => {
    const { id } = req.params;
    var {vNumber, timeIn, timeOut, slot , cost} = req.body;
    l = Number(timeIn)
    k = Number(timeOut)
    cost = Number(cost)
    slot = Number(slot)
    const newEntry = new parkingLot({'owner': id, 'customer': null, 'vehicle': vNumber,'dob': l ,'timeIn': l, 'timeOut': k, 'slot': slot });
    await newEntry.save();
    const owner = await ownerLog.findById(id);
    owner.carDetails.push(newEntry);
    await owner.save();
    res.render('check', {message: "Booked", nota: null, name: owner['parkingname'], timeIn: l, number: vNumber ,id: id})
}));


module.exports = router;

