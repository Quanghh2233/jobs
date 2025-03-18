const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance with SQLite
const dbPath = process.env.DB_PATH || path.join(__dirname, '../sqlite.db');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false // Set to console.log to see SQL queries
});

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite database connection established successfully');

        // Sync all defined models to the DB
        await sequelize.sync();
        console.log('Database models synchronized');
        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        return false;
    }
};

module.exports = { connectDB, sequelize };
