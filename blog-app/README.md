# Blog Application

A full-stack blog application built with Node.js, Express, SQLite, and React.

## Features

- User authentication (register, login)
- Create, read, update, and delete blog posts
- Responsive design
- File-based SQLite database (no server required)

## Setup Instructions

### Prerequisites

- Node.js (v12 or later)
- npm (comes with Node.js)
- SQLite (included as a dependency, no separate installation required)

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
   DATABASE_URL=sqlite://./database.sqlite
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
2. **SQLite**: No separate installation required, included as a dependency

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

## API Endpoints and Headers

### Posts
- GET /api/posts - Get all posts
  - No authentication required
  - Headers: None required

- GET /api/posts/:id - Get post by ID
  - No authentication required
  - Headers: None required

- POST /api/posts - Create a new post
  - Authentication required
  - Headers:
    ```
    Content-Type: multipart/form-data
    Authorization: Bearer <your_jwt_token>
    ```

- PUT /api/posts/:id - Update a post
  - Authentication required
  - Headers: 
    ```
    Content-Type: multipart/form-data
    Authorization: Bearer <your_jwt_token>
    ```

- DELETE /api/posts/:id - Delete a post
  - Authentication required
  - Headers:
    ```
    Authorization: Bearer <your_jwt_token>
    ```

### Users
- POST /api/users - Register a new user
  - No authentication required
  - Headers:
    ```
    Content-Type: application/json
    ```

- POST /api/users/login - Login
  - No authentication required
  - Headers:
    ```
    Content-Type: application/json
    ```

## API Request Bodies

### Register User
- POST /api/users
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
  
  Example successful response:
  ```json
  {
    "_id": "60d5ec9af3b64a001f3b2c1a",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  
  Example error response:
  ```json
  {
    "errors": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
  ```

### Login User
- POST /api/users/login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
  
  Example successful response:
  ```json
  {
    "_id": "60d5ec9af3b64a001f3b2c1a",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  
  Example error response:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### Create Post
- POST /api/posts (multipart/form-data)
  - Form fields:
    ```
    title: "My First Blog Post"
    content: "This is the content of my first blog post..."
    tags: "technology,programming,webdev"
    image: (file upload - optional)
    ```
  
  Example successful response:
  ```json
  {
    "_id": "60d5ec9af3b64a001f3b2c1b",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "user": "60d5ec9af3b64a001f3b2c1a",
    "tags": ["technology", "programming", "webdev"],
    "image": "/uploads/1624553625984-myimage.jpg",
    "createdAt": "2023-06-25T10:20:25.984Z",
    "updatedAt": "2023-06-25T10:20:25.984Z"
  }
  ```
  
  Example error response:
  ```json
  {
    "errors": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
  ```

### Update Post
- PUT /api/posts/:id (multipart/form-data)
  - Form fields:
    ```
    title: "Updated Blog Post Title"
    content: "This is the updated content..."
    tags: "technology,programming,updated"
    image: (file upload - optional)
    ```
  
  Example successful response:
  ```json
  {
    "_id": "60d5ec9af3b64a001f3b2c1b",
    "title": "Updated Blog Post Title",
    "content": "This is the updated content...",
    "user": "60d5ec9af3b64a001f3b2c1a",
    "tags": ["technology", "programming", "updated"],
    "image": "/uploads/1624553625984-myimage.jpg",
    "createdAt": "2023-06-25T10:20:25.984Z",
    "updatedAt": "2023-06-25T11:20:25.984Z"
  }
  ```
  
  Example error response:
  ```json
  {
    "message": "Not authorized to update this post"
  }
  ```

## Authentication and Authorization Guide

### How to Get an Authorization Token

1. Register a new user or login with existing credentials:

   **Registration:**
   ```bash
   curl -X POST http://localhost:5000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

   **Login:**
   ```bash
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

2. Both endpoints will return a response containing a JWT token:

   ```json
   {
     "_id": "1",
     "name": "John Doe",
     "email": "john@example.com",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2MTY3NTIyMjcsImV4cCI6MTYxOTM0NDIyN30.bHygAzpIpWoswxCg8vVh2qEuHZQpr9OPeGWpHQgYptQ"
   }
   ```

3. Save this token for use in protected routes.

### Using the Authorization Token

For any protected endpoints (creating/updating/deleting posts), you must include the token in your request headers:

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: multipart/form-data" \
  -F "title=My Post Title" \
  -F "content=This is my post content" \
  -F "tags=test,blog,api" \
  -F "image=@/path/to/image.jpg"
```

Replace `YOUR_TOKEN_HERE` with the actual token you received when logging in.

### Frontend Authorization

In your React application:

1. **Store the token** after login/registration:

   ```javascript
   // After a successful login API call
   const handleLogin = async (email, password) => {
     try {
       const { data } = await axios.post('http://localhost:5000/api/users/login', {
         email, 
         password
       });
       
       // Save token and user info to localStorage
       localStorage.setItem('userInfo', JSON.stringify(data));
       
       // Redirect user to homepage
       navigate('/');
     } catch (error) {
       // Handle error
     }
   };
   ```

2. **Use the token** for protected API calls:

   ```javascript
   const createPost = async (postData) => {
     try {
       // Get user info (with token) from localStorage
       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
       
       if (!userInfo || !userInfo.token) {
         // Redirect to login if no token
         navigate('/login');
         return;
       }
       
       const config = {
         headers: {
           'Content-Type': 'multipart/form-data',
           Authorization: `Bearer ${userInfo.token}`
         }
       };
       
       const { data } = await axios.post('http://localhost:5000/api/posts', 
         postData, 
         config
       );
       
       // Handle success
     } catch (error) {
       // Handle error
     }
   };
   ```

3. **Logout** by removing the token:

   ```javascript
   const logout = () => {
     localStorage.removeItem('userInfo');
     navigate('/login');
   };
   ```

### Common Authorization Issues

1. **Token expired**: JWTs have an expiration date (30 days by default in this app). You'll need to login again to get a new token.

2. **Invalid token format**: Ensure you're using the format `Bearer YOUR_TOKEN_HERE` with a space after "Bearer".

3. **Missing token**: Check that you're properly including the Authorization header in your requests.

4. **Unauthorized access**: If you get a 403 error, it means your token is valid but you don't have permission for that action (e.g., trying to update another user's post).

## Technologies Used

- Backend: Node.js, Express, SQLite, Sequelize
- Frontend: React, React Router, Axios
- Authentication: JSON Web Tokens (JWT)

## Troubleshooting

### SQLite Connection Issues

If you see an error like `Error: SQLITE_CANTOPEN: unable to open database file`, it means your application cannot connect to the SQLite database. Here's how to fix it:

1. Ensure the database file path is correct in your .env file:
   ```
   DATABASE_URL=sqlite://./database.sqlite
   ```

2. Ensure the directory for the database file exists:
   ```bash
   mkdir -p ./backend
   ```

3. Ensure the application has write permissions to the directory:
   ```bash
   chmod -R 755 ./backend
   ```

### React 'digital envelope routines::unsupported' Error

If you encounter this error when starting the frontend:
```
Error: error:060800A3:digital envelope routines::unsupported
```
This is due to a compatibility issue with the OpenSSL version used by Node.js. To fix this, set the `NODE_OPTIONS` environment variable before starting the frontend:

For Windows (Command Prompt):
```
set NODE_OPTIONS=--openssl-legacy-provider && npm start
```

For Windows (PowerShell):
```
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
```

For macOS/Linux:
```
export NODE_OPTIONS=--openssl-legacy-provider && npm start
```

#### Docker Alternative:
If you're having trouble with local SQLite setup, you can run the application in Docker:

```bash
docker-compose up
```

Then update your .env file:

## Database Options

This application can work with either SQLite or MongoDB:

### SQLite Setup (Default - File-based database, no server required)

### MongoDB Setup (Optional - Server-based database)
