# MyBlog — Backend

RESTful API for a full-stack blogging platform built with Node.js and Express.
Previously deployed on AWS EC2 with Nginx and PM2.

## Tech Stack
- Node.js, Express.js
- MongoDB, Mongoose
- JWT Authentication
- AWS EC2, Nginx, PM2

## Features
- JWT-based auth with secure route protection
- Blog management — create, edit, delete, category filtering
- User roles — admin and reader
- Comment moderation system — approve, reject, pending queue
- Email notifications
- Subscriber management
- Data persistence with MongoDB

## API Structure
- `/auth` — login, register, token handling
- `/blogs` — CRUD, category filtering
- `/comments` — moderation queue
- `/subscribers` — subscription management
- `/users` — user management (admin only)

## Local Setup
```bash
npm install
npm run dev
```
Create a `.env` file with:
