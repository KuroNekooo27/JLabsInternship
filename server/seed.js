require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import the User model

const MONGO_URI = process.env.MONGO_URI;

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection successful for seeding.');

        // 1. Define the test user credentials
        const testUserEmail = 'test@example.com';
        const testPassword = 'password123';
        const saltRounds = 10;

        // 2. Check if the user already exists
        const existingUser = await User.findOne({ email: testUserEmail });
        if (existingUser) {
            console.log('Test user already exists. Skipping insertion.');
            await mongoose.disconnect();
            return;
        }

        // 3. Hash the password before saving
        const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
        

        // 4. Create and save the new user
        const newUser = new User({
            email: testUserEmail,
            password: hashedPassword // Save the HASHED password
        });

        await newUser.save();
        console.log(`Test user created successfully: ${testUserEmail}`);

        await mongoose.disconnect();
        console.log('Database seeding finished.');

    } catch (error) {
        console.error('Database seeding failed:', error.message);
        await mongoose.disconnect();
    }
};

seedDB();