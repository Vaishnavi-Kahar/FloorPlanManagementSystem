require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGOURL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));


app.use('/',authRoutes);//login - signup

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}...`);
})