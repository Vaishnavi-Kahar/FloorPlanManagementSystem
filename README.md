# Intelligent Floor Plan Management System

## Introduction

The Intelligent Floor Plan Management System is designed to provide a seamless workspace experience by allowing administrators to manage and optimize floor plans effectively. This system includes features for robust user authentication, conflict resolution, version control, offline synchronization, meeting room optimization, and comprehensive error handling. This document provides a detailed case study of the system's implementation, including code snippets, data structures, algorithms, and time/space complexity analysis.

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
#### Implementation:

- **Fault-Tolerant Mechanisms:** Use of redundant servers and regular backups.
- **Backup and Recovery:** Regular data backups to ensure data integrity.
- **Error Recovery Procedures:** Comprehensive error handling to minimize downtime.

### Code Snippet

#### `utils/errorHandler.js`

```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

```


## 4. Object-Oriented Programming Language (OOPS)
#### Implementation:

- **Encapsulation:** Encapsulate related data and methods within models.
- **Inheritance and Polymorphism:** Utilize Mongoose schemas to create reusable and extendable models.


### Code Snippet

#### `models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);

```


## 5. Trade-offs in the System
#### Considerations:
- **Security vs. Usability:**  JWT provides robust security at the cost of slightly increased complexity.


`

## 6.Error and Exception Handling

#### Implementation
- **Error Handling Framework**: Comprehensive error handling using Express middleware.
- **Meaningful Error Messages**: Provide clear and actionable error messages.
- **Regular Reviews**: Periodic review and update of error-handling strategies.

### Code Snippet

#### `app.js`

```javascript
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./utils/errorHandler');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/floorPlanDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Meeting Room Optimization

#### Implementation
- **Recommendation System**: Suggests the best meeting room based on capacity and availability.
- **Dynamic Updates**: Continuously updates recommendations as bookings occur.

### Code Snippet

#### `services/meetingRoomService.js`

```javascript
const MeetingRoom = require('../models/MeetingRoom');

exports.bookMeetingRoom = async (requirements) => {
  const availableRooms = await MeetingRoom.find({ booked: false, capacity: { $gte: requirements.capacity } }).sort({ capacity: 1 });
  if (availableRooms.length === 0) throw new Error('No available rooms');

  const room = availableRooms[0];
  room.booked = true;
  room.bookedBy = requirements.userId;
  room.bookedAt = new Date();
  await room.save();

  return room;
};

exports.suggestMeetingRoom = async (requirements) => {
  const availableRooms = await MeetingRoom.find({ booked: false, capacity: { $gte: requirements.capacity } }).sort({ capacity: 1 });
  if (availableRooms.length === 0) return null;

  return availableRooms[0];
};
```

## Conclusion
This comprehensive case study provides a detailed overview of the Intelligent Floor Plan Management System, including robust user authentication, conflict resolution, version control, offline synchronization, meeting room optimization, and comprehensive error handling. The implementation uses efficient algorithms and data structures to ensure optimal time and space complexity, while also considering important trade-offs in system design.
