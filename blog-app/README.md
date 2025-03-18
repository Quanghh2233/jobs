# Blog Application

A full-stack blog application built with Node.js, Express, MongoDB, and React.

## Features

- User authentication (register, login)
- Create, read, update, and delete blog posts
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blogdb
   JWT_SECRET=yoursecretkey
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and go to http://localhost:3000

## Windows-Specific Setup Instructions

### Installing Prerequisites on Windows

1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/)
2. **MongoDB**:
   - Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow the installation wizard
   - MongoDB typically installs as a service and starts automatically
   - The default connection string is `mongodb://localhost:27017`

### Running on Windows

1. Open Command Prompt or PowerShell
2. Navigate to the project:
   ```
   cd path\to\blog-app
   ```
3. Start backend:
   ```
   cd backend
   npm run dev
   ```
4. In a new Command Prompt or PowerShell window:
   ```
   cd path\to\blog-app\frontend
   npm start
   ```

### Common Windows Issues

1. **Port already in use**: If port 5000 or 3000 is already in use, you can change them:
   - For backend: Update PORT in .env file
   - For frontend: Run `set PORT=3001 && npm start` (Command Prompt) or `$env:PORT=3001; npm start` (PowerShell)

2. **MongoDB connection issues**:
   - Ensure MongoDB service is running in Services (Win+R, type `services.msc`)
   - Check Windows firewall if connecting to a remote MongoDB

## WSL (Windows Subsystem for Linux) Setup

### Setting Up WSL

1. Install WSL by opening PowerShell as Administrator and running:
   ```
   wsl --install
   ```
   This installs Ubuntu by default. Restart your computer after installation.

2. After restart, a terminal will open to set up your Ubuntu username and password

### Installing Prerequisites on WSL

1. Update your packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. Install Node.js and npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. Install MongoDB:
   ```bash
   # Import MongoDB public key
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   
   # Create list file for MongoDB
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   
   # Reload package database
   sudo apt update
   
   # Install MongoDB packages
   sudo apt install -y mongodb-org
   
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Enable MongoDB to start on boot
   sudo systemctl enable mongod
   ```

### Running on WSL

1. Navigate to your project:
   ```bash
   cd /path/to/blog-app
   ```

2. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

3. In a new WSL terminal:
   ```bash
   cd /path/to/blog-app/frontend
   npm start
   ```
   WSL will typically open the browser in Windows automatically.

### Accessing Windows Files from WSL

- Your Windows files are located at `/mnt/c/` in WSL
- If your project is in Windows, you can access it like:
  ```bash
  cd /mnt/c/Users/YourUsername/Projects/blog-app
  ```

### Accessing WSL Files from Windows

- WSL files can be accessed in Windows Explorer by typing `\\wsl$\Ubuntu` in the address bar
- You can also open your current WSL directory in Windows Explorer with:
  ```bash
  explorer.exe .
  ```

## API Endpoints

### Posts
- GET /api/posts - Get all posts
- GET /api/posts/:id - Get post by ID
- POST /api/posts - Create a new post
- PUT /api/posts/:id - Update a post
- DELETE /api/posts/:id - Delete a post

### Users
- POST /api/users - Register a new user
- POST /api/users/login - Login

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, React Router, Axios
- Authentication: JSON Web Tokens (JWT)
