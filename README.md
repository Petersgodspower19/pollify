Pollify 🗳️
Pollify is a real-time polling web application built with Next.js, MongoDB, and Socket.IO. It allows users to create, vote on, and view live results of polls — all in real time.
Getting Started
First, clone the repository and install dependencies:

bash
Copy
Edit
npm install
Then, run the development server:

bash
Copy
Edit
npm run dev
Open http://localhost:3000 in your browser to see the app.

You can start editing the project from the app/page.tsx file. The page auto-updates as you make changes.

Tech Stack
Frontend: Next.js (App Router, TypeScript)

Backend: Node.js, Express

Database: MongoDB Atlas

Real-Time Communication: Socket.IO

Styling: Tailwind CSS (or your preferred choice)

Features
✅ Create a new poll with multiple options

✅ Vote on any active poll

✅ View real-time updates of poll results

✅ Connects securely to a MongoDB Atlas cluster

MongoDB Setup
Make sure to create a MongoDB Atlas cluster and add your database URI to a .env.local file:

env
Copy
Edit
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/pollify?retryWrites=true&w=majority
Also add your backend server URL if needed:

env
Copy
Edit
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
Deployment
The easiest way to deploy your Next.js frontend is via Vercel.
For the backend (Express), you can use Render, Railway, or Fly.io.

Backend Deployment Tips
Don’t forget to add your environment variables on the deployment platform.

Use tools like pm2 or Docker if self-hosting.

Learn More
Next.js Docs

Socket.IO Docs

MongoDB Docs

Vercel Deployment Docs

