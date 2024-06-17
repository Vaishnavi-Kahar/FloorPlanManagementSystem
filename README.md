# Intelligent Floor Plan Management System

## Introduction

The Intelligent Floor Plan Management System is designed to provide a seamless workspace experience by allowing administrators to manage and optimize floor plans effectively. This system includes features for robust user authentication, offline synchronization, meeting room optimization, and comprehensive error handling. This document provides a detailed case study of the system's implementation, including code snippets, data structures, algorithms, and time/space complexity analysis.

## 1. Authentication

### Implementation
We use JWT (JSON Web Token) for secure authentication and authorization.

### Code Snippet

#### `controllers/authController.js`

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passKey = process.env.JWT_SECRET;

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      
      const user = await User.findOne({ username,password });
      
      if (user) {
        const payload = { username, role: user ? "user" : "admin" };
        const token = jwt.sign(payload, passKey);

        res.status(200).json({ message: "Login successful", token });
      } else {
        res.status(401).json({ message: "Please Sign up or Invalid credentials" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  },
  signup: async (req, res) => {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(409).json({ message: "Username already exists" });
      } else {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: "User signup successful", newUser });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred", error: error.message });
    }
  },
};

module.exports = authController;
```
### Time and Space Complexity
- Time Complexity: O(1) for token generation and user retrieval.
- Space Complexity: O(1) for token storage.

## 2. Cost Estimation - Time and Space

#### Data Structures:
- **MongoDB:** Used for database storage due to its flexibility and scalability.

### Code Snippet

#### `utils/conflictResolution.js`

```javascript
exports.resolveConflicts = (existingLayout, newLayout) => {
  const resolvedLayout = { ...existingLayout };

  for (const [key, value] of Object.entries(newLayout)) {
    if (existingLayout[key]) {
      if (value.timestamp > existingLayout[key].timestamp) {
        resolvedLayout[key] = value;
      }
    } else {
      resolvedLayout[key] = value;
    }
  }

  return resolvedLayout;
};
```

### Time and Space Complexity
- Time Complexity: O(n) where n is the number of elements in the layout.
- Space Complexity: O(n) for storing the resolved layout.

## 3. Handling System Failure Cases

### Code Snippet

#### `utils/errorHandler.js`

```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

```


## 4. Object-Oriented Programming Language (OOPS)

### Code Snippet

#### `models/User.js`

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);


```




## 5.Error and Exception Handling

#### Implementation
- **Error Handling Framework**: Comprehensive error handling using Express middleware.
- **Meaningful Error Messages**: Provide clear and actionable error messages.
- **Regular Reviews**: Periodic review and update of error-handling strategies.

### Code Snippet

#### `index.js`

```javascript
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
```

## Meeting Room Optimization

#### Implementation
- **Recommendation System**: Suggests the best meeting room based on capacity and availability.
- **Dynamic Updates**: Continuously updates recommendations as bookings occur.

### Code Snippet

#### `controllers/meetingRoomController.js`

```javascript
const MeetingRoom = require('../models/MeetingRoom');
const Booking = require('../models/Booking');

const meetingRoomController = {
  suggestMeetingRoom: async (req, res) => {
    const { participants } = req.body;
  
    try {
      // Find all rooms with capacity greater than or equal to the number of participants
      const rooms = await MeetingRoom.find({ capacity: { $gte: participants } })
        .sort({ capacity: 1, lastBooked: 1 })
        .exec();
  
      if (rooms.length === 0) {
        return res.status(404).json({ message: 'No suitable meeting room found' });
      }
  
      // Suggest the room with the smallest capacity that is greater than or equal to the number of participants
      const suitableRoom = rooms[0];
  
      res.status(200).json({ message: 'Meeting room suggested', meetingRoom: suitableRoom });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  }
  ,
  

  bookMeetingRoom: async (req, res) => {
    const { roomId, bookedBy, participants, startTime, endTime } = req.body;

  try {
    const meetingRoom = await MeetingRoom.findById(roomId);
    if (!meetingRoom) {
      return res.status(404).json({ message: 'Meeting room not found' });
    }

    if (participants > meetingRoom.capacity) {
      return res.status(400).json({ message: 'Number of participants exceeds room capacity' });
    }

    const overlappingBookings = await Booking.find({
      meetingRoom: roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Meeting room is already booked for the specified time slot' });
    }

    const newBooking = new Booking({ meetingRoom: roomId, bookedBy, participants, startTime, endTime });
    await newBooking.save();

    meetingRoom.lastBooked = new Date();
    await meetingRoom.save();

    res.status(201).json({ message: 'Meeting room booked successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
  }
};

module.exports = meetingRoomController;

```

## Conclusion
This comprehensive case study provides a detailed overview of the Intelligent Floor Plan Management System, including robust user authentication, offline synchronization, meeting room optimization, and comprehensive error handling. The implementation uses efficient algorithms and data structures to ensure optimal time and space complexity, while also considering important trade-offs in system design.
