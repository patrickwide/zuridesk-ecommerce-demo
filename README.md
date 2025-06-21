# Zuridesk E-commerce Platform

A full-stack e-commerce platform for office furniture and workspace accessories built with the MERN stack.

## Features

- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart with quantity management
- 👤 User authentication and profile management
- 💳 Secure checkout with PayPal integration
- 📦 Order tracking and management
- 🎨 Responsive design with dark/light mode
- 👮‍♂️ Admin dashboard for inventory and user management
- 📱 Mobile-friendly interface

## Tech Stack

### Frontend
- React with Vite
- Redux Toolkit for state management
- Chakra UI for components and styling
- React Router for navigation
- Formik & Yup for form validation
- Axios for API requests

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Swagger/ReDoc for API documentation
- Express Async Handler for error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Set up environment variables:
   - Copy `example.env` to `.env` in the root directory
   - Copy `backend/example.env` to `backend/.env`
   - Copy `client/example.env` to `client/.env`

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

5. Start MongoDB service

6. Seed the database (optional):
   ```bash
   cd backend
   node src/seeder.js
   ```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/docs

### Production Mode

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Start the production server:
   ```bash
   cd backend
   npm start
   ```

## API Documentation

- Swagger UI: http://localhost:5000/swagger
- ReDoc: http://localhost:5000/docs

## Features

### Customer Features
- Browse products by category
- Search products
- Filter by price and availability
- Shopping cart management
- Secure checkout process
- Order history and tracking
- Profile management

### Admin Features
- Product management (CRUD operations)
- Order management
- User management
- Dashboard with sales analytics
- Category management
- Inventory tracking

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Docker Deployment

The application can be run using Docker Compose, which sets up three containers:
- MongoDB database
- Node.js backend
- React frontend

### Prerequisites
- Docker
- Docker Compose

### Environment Setup
1. Copy the example environment files and configure them:
   ```bash
   cp example.env .env
   cp backend/example.env backend/.env
   cp client/example.env client/.env
   ```

2. Configure the following variables in root `.env`:
   ```
   MONGO_USERNAME=your_username
   MONGO_PASSWORD=your_password
   MONGO_DATABASE=zuridesk_db
   PORT=5000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   ```

### Running with Docker Compose

1. Build and start all containers:
   ```bash
   docker-compose up --build
   ```

2. Start in detached mode (background):
   ```bash
   docker-compose up -d
   ```

3. Stop all containers:
   ```bash
   docker-compose down
   ```

The services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Container Management

- View container logs:
  ```bash
  docker-compose logs -f [service_name]
  ```

- Restart a specific service:
  ```bash
  docker-compose restart [service_name]
  ```

Available service names:
- `frontend` - React application
- `backend` - Node.js API
- `mongodb` - MongoDB database

### Development with Docker

The setup includes volume mounts for live development:
- Frontend and backend code changes will trigger automatic rebuilds
- MongoDB data persists across container restarts
- Node modules are stored in named volumes for better performance

## Environment Configuration

The project uses three separate `.env` files for different parts of the application:

### Root Directory `.env`
Contains shared environment variables used by Docker Compose:
```
PORT=5000
MONGO_USERNAME=zuridesk_admin
MONGO_PASSWORD=your_secure_password
MONGO_DATABASE=zuridesk_db
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
```

### Backend `.env` (`/backend/.env`)
Contains backend-specific configuration:
```
PORT=5000
MONGO_USERNAME=zuridesk_admin
MONGO_PASSWORD=your_secure_password
MONGO_DATABASE=zuridesk_db
MONGO_URI=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongodb:27017/${MONGO_DATABASE}?authSource=admin
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### Frontend `.env` (`/client/.env`)
Contains frontend-specific configuration:
```
VITE_PAYPAL_CLIENT_ID=<VITE_PAYPAL_CLIENT_ID>
```

To set up the environment:
1. Copy the example environment files:
   ```bash
   cp example.env .env
   cp backend/example.env backend/.env
   cp client/example.env client/.env
   ```
2. Update each `.env` file with your specific configuration values
3. Make sure to replace `<VITE_PAYPAL_CLIENT_ID>` with your actual PayPal client ID

> **Note**: Never commit `.env` files to version control. The example files are provided as templates.
