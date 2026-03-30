Tech Stack & Infrastructure
Frontend: React + Vite (Port 5174)

Backend: Node.js + Express (Port 5001)

Database: MongoDB (Port 27017)

Orchestration: Docker Compose

Auth: JWT (JSON Web Tokens) & Bcryptjs for password hashing.

Prerequisites
Before starting, ensure you have the following installed on your machine:

Docker Desktop (Crucial: Ensure Docker is running before executing commands).

VS Code

MongoDB Compass (Optional: for visualizing the database).

1. clone the repo
git clone <your-repo-link>
cd project-rz2

2. Configure Environment Variables
cp .env.example .env

3. Open the .env file and ensure the values match the following (Standard for Docker):
PORT=5001
MONGO_URI=mongodb://database:27017/rz2
JWT_SECRET=any_random_string_here

Spin up the container
docker compose up --build

4. Access the Application
Frontend: http://localhost:5174

Backend API: http://localhost:5001/api

Database: mongodb://localhost:27017 (via MongoDB Compass)

Seeding the Admin User
The database starts empty. To log in, you need the initial Coordinator account.

The backend is configured to automatically check for an admin user on startup.
Check your Docker logs for the message: SEEDER: Test Admin Created (admin / password123).
Go to the login page and use these credentials:

Username: admin
Password: password123