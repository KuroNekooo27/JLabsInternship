const User = require('../models/User'); // Mongoose User Model
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For token generation

// @route   POST /api/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email, explicitly including the password field
        // The .select('+password') is necessary because we set 'select: false' in the model
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials (Email not found)' });
        }

        // 2. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials (Password mismatch)' });
        }
        

        // 3. Create payload and sign the token
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                // Add any other non-sensitive data needed for quick access
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                // 4. Send back the token (The client needs this to access protected routes)
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login process');
    }
};