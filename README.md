# BG Remover App

AI-powered background removal application built with React and Node.js.

## Description

BG Remover is a web application that allows users to remove backgrounds from images using artificial intelligence. The project consists of two main parts:
- **Client** - React frontend application
- **Server** - Node.js backend API

## Features

- **Background Removal** - Remove backgrounds from images using ClipDrop API
- **User Authentication** - Secure authentication with Clerk
- **Credit System** - Users get 5 free credits with automatic refresh every 2 minutes
- **Image Upload** - Support for various image formats
- **Responsive Design** - Works on desktop and mobile devices
- **Real-time Processing** - Fast image processing with instant results

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Clerk for authentication
- Multer for file uploads
- ClipDrop API for background removal

##  Project Structure

```
BG-remover/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── configs/
│   └── package.json
├── docs/                   # Generated documentation
└── package.json           
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Clerk account
- ClipDrop API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BG-remover
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Environment Setup

Create `.env` file in the server directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017
CLIPDROP_API=your_clipdrop_api_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

### Running the Application

1. **Start the server** (from root directory)
   ```bash
   cd server
   npm run server
   ```

2. **Start the client** (from root directory)
   ```bash
   cd client
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

##  API Endpoints

### User Routes
- `POST /api/user/webhooks` - Clerk webhook handler
- `GET /api/user/credits` - Get user credits information
- `POST /api/user/check-timer` - Check credit timer status

### Image Routes
- `POST /api/image/remove-bg` - Remove background from image

## Credit System

- **Initial Credits**: 5 credits per user
- **Refresh Rate**: 1 credit every 2 minutes
- **Maximum Credits**: 5 credits
- **Timer**: Automatic credit refresh when below maximum


## Testing

Run tests for the server:
```bash
cd server
npm test
```

## Deployment

### Client (Vercel)
The client is configured for Vercel deployment with `vercel.json` configuration.

### Server (Vercel)
The server is also configured for Vercel deployment with proper routing.


## 📄 License

This project is licensed under the ISC License.


## 🔗 Links

- [ClipDrop API](https://clipdrop.co/apis)
- [Clerk Documentation](https://clerk.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)