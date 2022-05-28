const mongoose = require('mongoose');

const desSchema = new mongoose.Schema({
    about : {
        type : String,
    },
    pic : {
        type : String,
    },
});

const timeSchema = new mongoose.Schema({
    date : String ,
    time : [{
        value : { type : String},
        count : {
            type : Number,
            default : 0,
            max : 5,
        }
    }]
});

const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    branch : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    description : desSchema,
    field : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : "doctor"
    },
    timings : [timeSchema],
    
},
{strict: false},
{
    timestamps : true,
});

const doctSchema = mongoose.model('Doctor', doctorSchema);

module.exports = doctSchema;
