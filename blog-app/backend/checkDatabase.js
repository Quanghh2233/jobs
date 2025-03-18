const { sequelize } = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

console.log('Database Check Utility');
console.log('=====================');

// Check DB file existence
const dbPath = process.env.DB_PATH || path.join(__dirname, 'sqlite.db');
console.log(`Database path: ${dbPath}`);

if (fs.existsSync(dbPath)) {
    console.log(`✅ Database file exists (${Math.round(fs.statSync(dbPath).size / 1024)} KB)`);
} else {
    console.log(`⚠️ Database file doesn't exist yet - will be created on server start`);
}

// Test database connection
async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to the database has been established successfully.');

        // Check models
        console.log('\nChecking models...');
        const userCount = await User.count();
        console.log(`✅ User model is working (${userCount} users in database)`);

        const postCount = await Post.count();
        console.log(`✅ Post model is working (${postCount} posts in database)`);

        // Create test data if none exists
        if (userCount === 0) {
            console.log('\nCreating test user...');
            try {
                const testUser = await User.create({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });
                console.log(`✅ Created test user: ${testUser.name} (${testUser.email})`);

                if (postCount === 0) {
                    console.log('Creating test post...');
                    const testPost = await Post.create({
                        title: 'Welcome to the Blog',
                        content: 'This is a test post created automatically.',
                        userId: testUser.id,
                        tags: 'test,welcome,blog'
                    });
                    console.log(`✅ Created test post: ${testPost.title}`);
                }
            } catch (err) {
                console.error('❌ Error creating test data:', err.message);
            }
        }

        console.log('\nDatabase check completed successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
    } finally {
        // Close connection
        await sequelize.close();
    }
}

checkConnection();
