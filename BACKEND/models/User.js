const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    aadhaar: {
        type: String,
        required: [true, 'Aadhaar number is required'],
        unique: true,
        match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number']
    },
    role: {
        type: String,
        enum: {
            values: ['patient', 'doctor', 'hospital', 'admin'],
            message: '{VALUE} is not a valid role'
        },
        default: 'patient'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// Add index for faster queries
UserSchema.index({ email: 1, aadhaar: 1 });

module.exports = mongoose.model('User', UserSchema); 