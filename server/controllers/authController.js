const User = require('../models/User'); // Mongoose User Model
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For token generation

// @route   POST /api/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email, explicitly including the password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials (Email not found)' });
        }

        // 2. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials (Password mismatch)' });
        }
        

        // FIX 1: Prepare the non-sensitive user data object to send back
        const userData = {
            id: user._id,
            email: user.email,
        };

        // 3. Create payload and sign the token
        const payload = {
            user: {
                id: user._id,
                email: user.email,
            },
        };
        

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                
                // FIX 2: Send back the token AND the user data
                res.json({ 
                    token,
                    user: userData // <-- ADDED USER DATA HERE
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        // NOTE: This catch block will execute if MONGO_URI or JWT_SECRET is missing/bad.
        res.status(500).send('Server Error during login process');
    }
};