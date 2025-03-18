/**
 * Debugging script to check if all required files and directories exist
 * and to display detailed error information
 */

const fs = require('fs');
const path = require('path');

console.log('Starting debug script...');

// Check environment variables
console.log('\n--- Environment Variables ---');
if (fs.existsSync(path.join(__dirname, '.env'))) {
    console.log('✅ .env file exists');

    // Load .env file and display non-sensitive variables
    require('dotenv').config();
    console.log('PORT:', process.env.PORT || 5000);
    console.log('MONGO_URI:', process.env.MONGO_URI ? '[Set]' : '[Not set]');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[Set]' : '[Not set]');
} else {
    console.log('❌ .env file does not exist');
}

// Check directories
console.log('\n--- Directories ---');
const dirs = ['uploads', 'middleware', 'routes', 'controllers', 'models', 'config'];
dirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, dir))) {
        console.log(`✅ ${dir} directory exists`);
    } else {
        console.log(`❌ ${dir} directory does not exist`);
    }
});

// Check key files
console.log('\n--- Key Files ---');
const files = [
    'server.js',
    'config/db.js',
    'middleware/authMiddleware.js',
    'middleware/uploadMiddleware.js',
    'middleware/validationMiddleware.js',
    'models/User.js',
    'models/Post.js',
    'routes/userRoutes.js',
    'routes/postRoutes.js',
    'controllers/userController.js',
    'controllers/postController.js'
];

files.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} does not exist`);
    }
});

// Check MongoDB connection
console.log('\n--- MongoDB Connection Test ---');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

try {
    if (process.env.MONGO_URI) {
        console.log('Attempting to connect to MongoDB...');
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('✅ MongoDB connection successful');
                mongoose.disconnect();
            })
            .catch(err => {
                console.log('❌ MongoDB connection failed:', err.message);
            });
    } else {
        console.log('❌ MONGO_URI is not set');
    }
} catch (err) {
    console.log('❌ Error testing MongoDB connection:', err.message);
}

console.log('\nDebug script completed. Check above for any issues.');
