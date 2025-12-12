const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users share the same email
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Ensures password is not returned by default find queries
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);