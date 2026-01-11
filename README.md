React Firebase Project Dashboard - for Futurinx dashboard

A simple React application using Firebase Authentication and Firestore that allows users to securely manage their own projects.


Tech Stack
- React (Vite)
- Firebase Authentication (Email & Password)
- Firebase Firestore
- react-hot-toast
- CSS (custom, responsive)

Features
- User authentication (Register / Login)
- Protected dashboard (only authenticated users)
- Create, view, and delete projects
- Each user can access **only their own data**
- Firestore security rules enforced
- Responsive UI (desktop & mobile)
- Delete confirmation using toast


Data Security
- Firestore rules restrict read/write access to authenticated users
- Users can only access documents where `userId === auth.uid`


Environment Setup

Create a `.env` file in the project root:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

