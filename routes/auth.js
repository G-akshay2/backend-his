var express = require('express');
var bcryptjs = require('bcryptjs');
var jsonwebtoken = require('jsonwebtoken');

const Doctors = require('../models/doctor');
const loginRouter = express.Router();
loginRouter.use(express.json());

loginRouter.route("/")
.post(async (req, res) => {
    try {
        let success = false;
        var doctor = await Doctors.findOne({username : req.body.username});
        if(!doctor) res.status(400).json({error : "Login with correct details"});
        const passwordCompare = await bcryptjs.compare(req.body.password, doctor.password);
        if(!passwordCompare) {
            res.status(400).json({error : "Login with correct details"});
        }
        const data = {
            user : {
                id : doctor.id,
            }
        }
        const authToken = jsonwebtoken.sign(data, process.env.JWT_SECRET_KEY);
        let role = doctor.role;
        success = true;
        res.json({success, role, authToken})
    } catch (error) {
        res.status(500).json({error : "Internal Server Error"});
    }
})

module.exports = loginRouter;