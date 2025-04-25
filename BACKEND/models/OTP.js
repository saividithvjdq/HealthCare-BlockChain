const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
    aadhaarNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhaar number!`
        }
    },
    otp: {
        type: String,
        required: true
    },
    otpHash: {
        type: String,
        required: true
    },
    previousHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires after 5 minutes
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3
    }
});

// Pre-save middleware to create blockchain-like hash
otpSchema.pre('save', function(next) {
    if (this.isModified('otp')) {
        // Create a hash combining OTP, timestamp, and previous hash
        const dataToHash = `${this.otp}${this.createdAt}${this.previousHash}${this.aadhaarNumber}`;
        this.otpHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    }
    next();
});

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(aadhaarNumber, otp) {
    try {
        const otpRecord = await this.findOne({ 
            aadhaarNumber,
            otp
        });

        if (!otpRecord) {
            return {
                isValid: false,
                message: 'Invalid OTP'
            };
        }

        // Check if OTP is expired
        const now = new Date();
        const otpAge = now - otpRecord.createdAt;
        if (otpAge > 300000) { // 5 minutes in milliseconds
            await this.deleteOne({ _id: otpRecord._id });
            return {
                isValid: false,
                message: 'OTP has expired'
            };
        }

        // Delete the used OTP
        await this.deleteOne({ _id: otpRecord._id });

        return {
            isValid: true,
            message: 'OTP verified successfully'
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

// Static method to generate OTP
otpSchema.statics.generateOTP = async function(aadhaarNumber) {
    try {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        await this.findOneAndUpdate(
            { aadhaarNumber },
            { otp },
            { upsert: true, new: true }
        );

        // In production, you would send this OTP via SMS
        console.log(`OTP for ${aadhaarNumber}: ${otp}`);
        
        return otp;
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
};

module.exports = mongoose.model('OTP', otpSchema); 