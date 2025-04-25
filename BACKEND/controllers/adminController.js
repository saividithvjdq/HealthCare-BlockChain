const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const logger = require('../utils/logger');

// Create new admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Create new admin
        admin = new Admin({
            name,
            email,
            password
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();

        // Create JWT token
        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        logger.error('Error in admin creation:', err);
        res.status(500).json({ message: 'Server error during admin creation' });
    }
};

// Admin login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        logger.error('Error in admin login:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get admin profile
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (err) {
        logger.error('Error fetching admin profile:', err);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// Update admin profile
exports.updateAdminProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const adminFields = {};
        if (name) adminFields.name = name;
        if (email) adminFields.email = email;

        let admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin = await Admin.findByIdAndUpdate(
            req.admin.id,
            { $set: adminFields },
            { new: true }
        ).select('-password');

        res.json(admin);
    } catch (err) {
        logger.error('Error updating admin profile:', err);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
}; 