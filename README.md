ceneSync

SceneSync is a real-time, AI-verified citizen journalism platform that enables citizens to report on-ground incidents using photos, videos, and audio, while editors verify, manage, and approve submissions through a dedicated dashboard.

The platform is built using a PERN stack (PostgreSQL, Express, React, Node.js) with Supabase, Cloudinary, and Google Vision AI for verification.

🚀 Features
👤 User

User signup & login

View editor-created reporting tasks

Submit incident reports (image + description, optional audio)

Track submission status

🧑‍💼 Editor

Editor login (role-based access)

Create reporting tasks by location

View incoming submissions in real time

Approve / reject submissions

Trust-based moderation workflow

🤖 AI Verification (Backend)

EXIF metadata extraction (GPS + timestamp)

Location validation (Haversine distance)

Google Vision label detection

SafeSearch explicit content filtering

Automated relevance scoring

🧱 Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Axios

Socket.io client

Backend

Node.js

Express

Multer (file uploads)

Supabase (PostgreSQL + Auth + Realtime)

Cloudinary (media storage)

Google Vision API

Database

Supabase PostgreSQL

Row Level Security (RLS) enabled

📂 Project Structure
SceneSync/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── editor/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── README.md
└── .env

🛠️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-org-or-username>/SceneSync.git
cd SceneSync

2️⃣ Backend Setup
Install dependencies
cd server
npm install

Create .env file inside /server
PORT=3001

DATABASE_URL=postgresql://<user>:<password>@<host>:5432/postgres

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GOOGLE_API_KEY=your_google_vision_api_key

Run backend server
npm run dev


Backend runs at:

http://localhost:3001

3️⃣ Frontend Setup
Install dependencies
cd ../client
npm install

Run frontend
npm run dev


Frontend runs at:

http://localhost:5173

🔐 Authentication Flow

Supabase handles authentication

User and Editor flows are separated using protected routes

PrivateRoute → User access

EditorRoute → Editor-only access

🧠 Editor Layout Architecture

EditorLayout owns the sidebar and layout

Editor pages render content only

Prevents UI duplication and improves scalability

🧪 Running the App Locally

Start backend (server)

Start frontend (client)

Visit /

Choose User or Editor

Log in

Access dashboards and submit/view reports

🎨 UI Design Philosophy

Modern startup UI

Tailwind utility-first styling

Shared UI components (Card, Button, Input)

Distinct color identity:

User → Blue

Editor → Purple

⚠️ Notes

Backend must be running for dashboards to function

Media upload currently supports one image (MVP)

Audio/video support is extensible

Google Maps API is intentionally not used

👥 Team Workflow

Feature-based Git branches

Layouts centralized to avoid conflicts

Backend and frontend developed independently

📌 Future Enhancements

Realtime editor notifications

Trust score visualization

Map-based task discovery

Public verified news feed

🏁 Final Note

SceneSync demonstrates real-world system design, secure data handling, and scalable UI architecture — suitable for hackathons, academic evaluation, and future production u
