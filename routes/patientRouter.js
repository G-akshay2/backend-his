const express = require('express');
const verify  = require('./verify');
const Patients = require('../models/patient');

const patientRouter = express.Router();
patientRouter.use(express.json());

patientRouter.route("/")
.get(verify.verifyUser, verify.verifyAdmin, async (req, res) => {
    let patients = await Patients.find({});
    if(patients) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(patients);
    }
    else {
        const err = new Error("Patients not found");
        res.send(err); 
    }
})
.post(async (req, res) => {
    let patient = await Patients.create(req.body);
    if(patient) {
        res.setHeader('Content-Type', 'application/json');
        let success = true
        res.status(200).json({success, patient});
    }
    else {
        const err = new Error("Appointment Booking Failed");
        res.send(err); 
    }
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("Put is not possible");
})
.delete(verify.verifyUser, verify.verifyAdmin, async (req, res) => {
    let patients = await Patients.deleteMany({});
    if(patients) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(patients);
    }
    else {
        const err = new Error("Patients not found");
        res.send(err); 
    }
})

patientRouter.route("/:patientId")
.get(verify.verifyUser, verify.verifyAdmin, async (req, res) => {
    let patient = await Patients.findById(req.params.patientId);
    if(patient) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(patient);
    }
    else {
        const err = new Error("Patient not found");
        res.send(err); 
    }
})
.post(async (req, res) => {
    res.statusCode = 403;
    res.end("Post is not possible");
})
.put(verify.verifyUser, verify.verifyDoctor, async (req, res) => {
    let patient = await Patients.findByIdAndUpdate(req.params.patientId, {$set : req.body}, 
        {new : true});
    if(patient) {
        res.statusCode = 200;
        res.send(patient);
    }
    else {
        res.status(404).send("Patient not found");
    }
})
.delete(verify.verifyUser, verify.verifyAdmin, async (req, res) => {
    let patient = await Patients.findByIdAndDelete(req.params.patientId);
    if(patient) {
        res.setHeader('Content-Type','application/json');
        res.status(200).send(patient);
    }
    else {
        const err = new Error("Patient not Found");
        res.send(err);
    }
})

patientRouter.route("/:patientId/pres")
.get(verify.verifyUser, verify.verifyDoctor, async (req, res) => {
    let patient = await Patients.findById(req.params.patientId);
    if(patient) {
        res.setHeader('Content-Type','application/json');
        res.status(200).send(patient.prescription);
    }
    else {
        const err = new Error("Patient not Found");
        res.send(err); 
    }
})
.post(verify.verifyUser, verify.verifyDoctor, (req, res) => {
    Patients.findById(req.params.patientId)
    .then(async (patient) => {
        if(!req.body.length) {
            const newPrescripton = {};
            newPrescripton.medicine_name = req.body.medicine_name;
            newPrescripton.timing = req.body.timing;
            patient.prescription.push(newPrescripton);
            await patient.save();
            res.setHeader('Content-Type','application/json');
            res.send(patient)
        }
        else {
            for (let index = 0; index < req.body.length; index++) {
                let newPrescripton = {};
                newPrescripton.medicine_name = req.body[index].medicine_name;
                newPrescripton.timing = req.body[index].timing;
                patient.prescription.push(newPrescripton);
                await patient.save();
            }
            res.setHeader('Content-Type','application/json');
            res.send(patient)
        }
    },err => res.send(err));
})
.put(verify.verifyUser, verify.verifyDoctor, (req, res) => {
    res.statusCode = 403;
    res.end("Put is not possible");
})
.delete(verify.verifyUser, verify.verifyDoctor, async (req, res) => {
    let patient = await Patients.findByIdAndDelete(req.params.patientId);
    if(patient) {
        for (let index = 0; index < patient.prescription.length; index++) {
            patient.prescription.id(patient.prescription[index]._id).remove();
        }
        await patient.save();
        res.status(200).send(patient);
    }
    else {
        let err = new Error("No Prescription Found");
        res.send(err);
    }
})

patientRouter.route("/:patientId/pres/:presId")
.get(verify.verifyUser, verify.verifyDoctor, (req, res) => {
    Patients.findById(req.params.patientId)
    .then((patient) => {
        if (patient != null && patient.prescription.id(req.params.presId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(patient.prescription.id(req.params.presId));
        }
        else if (patient == null) {
            err = new Error('patient ' + req.params.patientId + ' not found');
            err.status = 404;
            return res.send(err);
        }
        else {
            err = new Error('Prescription ' + req.params.presId + ' not found');
            err.status = 404;
            return res.send(err);            
        }
    }, err => res.send(err));
})
.post(verify.verifyUser, verify.verifyDoctor, (req, res) => {
    res.status(403).send("Post operation cannot performed");
})
.put(verify.verifyUser, verify.verifyDoctor, (req, res) => {
    Patients.findById(req.params.patientId)
    .then((patient) => {
        if (patient != null && patient.prescription.id(req.params.presId) != null) {
            if (req.body.medicine_name) {
                patient.prescription.id(req.params.presId).medicine_name = req.body.medicine_name;
            }
            if (req.body.timing) {
                patient.prescription.id(req.params.presId).timing = req.body.timing;                
            }
            patient.save()
            .then((patient) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(patient); 
            })
        }
    }, (err) => res.send(err))
})
.delete(verify.verifyUser, verify.verifyDoctor, (req, res) => {
    Patients.findById(req.params.patientId)
    .then((patient) => {
        if (patient != null && patient.prescription.id(req.params.presId) != null) {
            patient.prescription.id(req.params.presId).remove();
            patient.save()
            .then((patient) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(patient);
            }, (err) => res.send(err))
        }
    }, (err) => res.send(err))
})

patientRouter.route("/patients/getbyname")
.post(async (req, res) => {
    let patients = await Patients.find({doctor_name : req.body.doctor_name});
    if(patients) {
        res.status(200).json(patients)
    }
    else {
        res.send("No patients found")
    }
})

patientRouter.route("/patients/gettoken/token/id/work")
.post(async (req, res) => {
    let patients = await Patients.findOne({token : req.body.token});
    if(patients) {
        res.status(200).json(patients);
    }
    else {
        res.json({success : false});
    }
})

module.exports = patientRouter;