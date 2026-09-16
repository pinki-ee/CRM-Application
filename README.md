# CRM Application

A full-stack Customer Relationship Management (CRM) application designed to help organizations manage customers, leads, deals, users, and business activities through a centralized and responsive platform.

## 🚀 Overview

The CRM Application provides a structured platform for managing customer relationships and sales-related data.

It includes secure authentication, role-based access, a responsive dashboard, customer management, lead management, deal management, activity tracking, user profiles, and an admin management panel.

The application is built with a modern React frontend and a Node.js/Express backend connected to MongoDB.

## ✨ Key Features

### 🔐 Authentication
- User registration and login
- Secure authentication using JWT
- Role-based access for Users and Admins
- Protected routes and API endpoints

### 📊 Dashboard
- Overview of customers, leads, and deals
- Recent activity section
- Data visualization with charts
- Responsive dashboard layout

### 👥 Customer Management
- View customer records
- Add new customers
- Edit customer information
- Delete customer records
- Organized customer data management

### 🎯 Lead Management
- View and manage leads
- Add new leads
- Update lead information
- Delete leads
- Track lead-related information

### 💼 Deal Management
- View deals
- Create new deals
- Update deal information
- Delete deals
- Manage sales-related records

### 🛡️ Admin Panel
- Admin authentication
- User management

### 👤 Profile
- User profile page
- User information management
- Logout functionality

### 📱 Responsive Design
- Responsive interface for laptop, and mobile screens
- Clean and user-friendly UI
- Reusable React components

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Development & Testing
- VS Code
- GitHub
- Thunder Client
- MongoDB

- ## ⚙️ Installation & Setup

### 1. Clone the Repository

git clone https://github.com/pinki-ee/CRM-Application.git

### 2. Setup Frontend

Navigate to the frontend folder:

cd CRM/frontend
npm install
npm run dev

The frontend will start on the Vite development server.

### 3. Setup Backend

Open a new terminal and navigate to the backend folder:

cd CRM/backend
npm install
npm start

The backend server will run on port 5000.

### 4. Environment Variables

Create a `.env` file inside the `backend` folder and add the required configuration:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Do not upload the `.env` file to GitHub because it may contain sensitive credentials.

## 👩‍💻 Developer

**Pinki Prajapati**

GitHub: https://github.com/pinki-ee
