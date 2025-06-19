# Zuridesk E-commerce Backend

This is the backend server for the Zuridesk E-commerce platform.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/zuridesk_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

3. Start MongoDB service:
```bash
sudo service mongodb start
```

4. Seed the database (optional):
```bash
node src/seeder.js
```

5. Start the server:
```bash
npm run dev
```

## API Documentation

The API documentation is available at http://localhost:5000/api-docs when the server is running.

## Available Scripts

- `npm run dev`: Start the server in development mode
- `npm start`: Start the server in production mode
- `node src/seeder.js`: Seed the database with sample data
- `node src/seeder.js -d`: Delete all data from the database

## API Endpoints

- `/api/products` - Product management
- `/api/users` - User management
- `/api/orders` - Order management
- `/api/categories` - Category management

For detailed API documentation, please visit the Swagger documentation at http://localhost:5000/api-docs