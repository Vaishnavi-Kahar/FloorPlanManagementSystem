require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const floorPlanRoutes = require('./routes/floorPlanRoutes');
const meetingRoomRoutes = require('./routes/meetingRoomRoutes');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGOURL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));


app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/floor-plans', floorPlanRoutes);
app.use('/api/meeting-rooms', meetingRoomRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}...`);
})