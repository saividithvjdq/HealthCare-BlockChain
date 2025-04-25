const Joi = require('joi');
const { AppError } = require('./errorHandler');

// Validation schemas
const schemas = {
    // Patient validation schemas
    patientRegistration: Joi.object({
        name: Joi.string().required().min(2).max(50),
        email: Joi.string().required().email(),
        phone: Joi.string().required().pattern(/^\+?[1-9]\d{9,14}$/),
        aadhaarNumber: Joi.string().required().length(12).pattern(/^\d+$/)
    }),

    // Health record validation schemas
    recordUpload: Joi.object({
        recordType: Joi.string().required().valid('prescription', 'labReport', 'diagnosis', 'vaccination', 'other'),
        description: Joi.string().required().min(10).max(500),
        isEmergencyAccessible: Joi.boolean().default(false)
    }),

    // Doctor access validation schemas
    accessControl: Joi.object({
        doctorId: Joi.string().required().hex().length(24),
        aadhaarNumber: Joi.string().required().length(12).pattern(/^\d+$/)
    }),

    // Emergency access validation schemas
    emergencyAccess: Joi.object({
        aadhaarNumber: Joi.string().required().length(12).pattern(/^\d+$/),
        reason: Joi.string().required().min(10).max(200)
    }),

    // Authentication validation schemas
    login: Joi.object({
        aadhaarNumber: Joi.string().required().length(12).pattern(/^\d+$/),
        otp: Joi.string().length(6).pattern(/^\d+$/)
    })
};

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            
            return next(new AppError(errorMessage, 400));
        }

        next();
    };
};

module.exports = {
    validate,
    schemas
}; 