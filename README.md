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
