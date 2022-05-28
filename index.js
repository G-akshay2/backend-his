var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
const dotenv = require('dotenv');

var patientRouter = require('./routes/patientRouter');
var doctorRouter = require('./routes/doctorRouter');
var loginRouter = require('./routes/auth');
var resetRouter = require('./routes/resetPassword');

var app = express();
app.use(express.json());
app.use(cors())
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    
})
.catch();

app.get('/',(req,res) => {
    res.send('Hello From Server');
})

app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/login', loginRouter);
app.use('/resetpassword', resetRouter);

app.listen(process.env.PORT || 5000, ()=>{
})