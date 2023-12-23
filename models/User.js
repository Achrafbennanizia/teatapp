const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    roles: [{
        type: String,
        default: "Employee",
        enum: ['Admin', 'Employee'],
    }],
    active: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('User', userSchema);
