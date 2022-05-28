var jsonwebtoken = require('jsonwebtoken');
var Doctors = require('../models/doctor');


exports.verifyUser = (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).json({error : "please authenticate yourself"});
    }
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data.user;
        next(); 
    }
    catch(error) {
        res.status(401).json({error : "please authenticate using valid token"});
    }
}

exports.verifyDoctor = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).json({error : "please authenticate yourself"});
    }
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data.user;
        let doctor = await Doctors.findById(data.user.id);
        if(doctor.role === 'doctor') {
            next();
        }
        else {
            res.send("You can't perform this operation");
        }
    }
    catch(error) {
        res.status(401).json({error : "please authenticate using valid token"});
    }
}

exports.verifyAdmin = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).json({error : "please authenticate yourself"});
    }
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data.user;
        let doctor = await Doctors.findById(data.user.id);
        if(doctor.role === 'admin') {
            next();
        }
        else {
            res.send("You can't perform this operation");
        }
    }
    catch(error) {
        res.status(401).json({error : "please authenticate using valid token"});
    }
}

exports.verifyReceptionist = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).json({error : "please authenticate yourself"});
    }
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
        req.user = data.user;
        let doctor = await Doctors.findById(data.user.id);
        if(doctor.role === 'reception' || doctor.role === 'admin' ) {
            next();
        }
        else {
            res.send("You can't perform this operation");
        }
    }
    catch(error) {
        res.status(401).json({error : "please authenticate using valid token"});
    }
}