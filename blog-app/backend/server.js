require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');

// Error handling function for handling async errors
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created at:', uploadsDir);
}

// Check if middleware files exist
try {
    // Check for required middleware files
    const authMiddleware = require('./middleware/authMiddleware');

    // The following will throw errors if the files don't exist
    try {
        require('./middleware/validationMiddleware');
        console.log('Validation middleware loaded');
    } catch (err) {
        console.error('Missing validation middleware:', err.message);
        console.log('Creating validation middleware file...');

        // Create validationMiddleware.js if it doesn't exist
        const middlewareDir = path.join(__dirname, 'middleware');
        if (!fs.existsSync(middlewareDir)) {
            fs.mkdirSync(middlewareDir, { recursive: true });
        }

        const validationContent = `
const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ]
}

const postValidationRules = () => {
    return [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('content').not().isEmpty().withMessage('Content is required')
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        errors: errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }))
    });
}

module.exports = {
    userValidationRules,
    postValidationRules,
    validate,
};`;

        fs.writeFileSync(path.join(middlewareDir, 'validationMiddleware.js'), validationContent);
        console.log('Created validation middleware file');
    }

    try {
        require('./middleware/uploadMiddleware');
        console.log('Upload middleware loaded');
    } catch (err) {
        console.error('Missing upload middleware:', err.message);
        console.log('Creating upload middleware file...');

        // Create uploadMiddleware.js if it doesn't exist
        const middlewareDir = path.join(__dirname, 'middleware');
        if (!fs.existsSync(middlewareDir)) {
            fs.mkdirSync(middlewareDir, { recursive: true });
        }

        const uploadContent = `
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created at:', uploadsDir);
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, \`\${Date.now()}-\${file.originalname.replace(/\\s+/g, '-')}\`);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images only (jpeg, jpg, png, gif)!'), false);
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = { upload };`;

        fs.writeFileSync(path.join(middlewareDir, 'uploadMiddleware.js'), uploadContent);
        console.log('Created upload middleware file');
    }

} catch (err) {
    console.error('Middleware error:', err.message);
    process.exit(1);
}

// Connect to database with more robust error handling
let connectAttempts = 0;
const maxConnectAttempts = 5;

const tryConnect = async () => {
    try {
        const connected = await connectDB();
        if (connected) {
            console.log('Database connected successfully');
            startServer();
        } else {
            handleConnectionFailure();
        }
    } catch (error) {
        handleConnectionFailure(error);
    }
};

const handleConnectionFailure = (error) => {
    connectAttempts++;
    if (error) {
        console.error(`Database connection attempt ${connectAttempts} failed: ${error.message}`);
    }

    if (connectAttempts < maxConnectAttempts) {
        const retrySeconds = 5;
        console.log(`Retrying in ${retrySeconds} seconds... (attempt ${connectAttempts} of ${maxConnectAttempts})`);
        setTimeout(tryConnect, retrySeconds * 1000);
    } else {
        console.error(`\n🔴 Failed to connect to database after ${maxConnectAttempts} attempts`);
        console.error('Starting server without database connection. API endpoints requiring database will not work.\n');
        startServer();
    }
};

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(morgan('dev'));

// Set static folder for uploads with absolute path
app.use('/uploads', express.static(uploadsDir));

// Load routes
let postRoutes, userRoutes;
try {
    postRoutes = require('./routes/postRoutes');
    userRoutes = require('./routes/userRoutes');
} catch (err) {
    console.error('Error loading routes:', err.message);
    process.exit(1);
}

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.send('Blog API is running');
});

// Error handling middleware (should be after routes)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: err.message || 'Something went wrong on the server',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Separate server start function
const startServer = () => {
    const PORT = process.env.PORT || 5000;

    try {
        const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

        // Handle server errors
        server.on('error', (err) => {
            console.error('Server error:', err.message);
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please use a different port.`);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
};

// Start connection process
tryConnect();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
