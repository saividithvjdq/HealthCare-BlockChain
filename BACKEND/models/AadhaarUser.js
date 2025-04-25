const mongoose = require('mongoose');

const aadhaarUserSchema = new mongoose.Schema({
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhaar number!`
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AadhaarUser', aadhaarUserSchema); 