const verifyAadhaar = async (req, res, next) => {
    try {
        const aadhaarNumber = req.headers['aadhaar-number'];
        
        if (!aadhaarNumber) {
            return res.status(401).json({ message: 'Aadhaar number required' });
        }

        // Basic Aadhaar validation (12 digits)
        if (!/^\d{12}$/.test(aadhaarNumber)) {
            return res.status(401).json({ message: 'Invalid Aadhaar format' });
        }

        req.aadhaarNumber = aadhaarNumber;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Authentication failed' });
    }
};

module.exports = { verifyAadhaar };