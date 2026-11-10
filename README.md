# MediQueue – Hospital Queue Management System

MediQueue is a web-based Hospital Queue Management System designed to simplify patient queue management in hospitals and clinics.

The system allows hospital staff to generate tokens for patients and manage the consultation queue. Patients can check the live queue status, see the currently serving token, and estimate their waiting time without creating an account.

## Features

### Staff Features
- Staff registration and login.
- Secure staff access to the dashboard.
- Generate patient tokens using the patient's name and mobile number.
- Automatically assign sequential token numbers.
- View the currently serving token.
- View the next token in the queue.
- Monitor the total number of waiting patients.
- View queue positions and estimated waiting times.
- Complete the current consultation and call the next patient.
- Automatically refresh queue information.

### Patient Features
- View the live hospital queue without logging in.
- Check the currently serving token.
- Check the next token.
- View the number of waiting patients.
- View estimated waiting times.
- Track queue positions using token numbers.

## Technology Stack

**Frontend**
- React.js
- JavaScript
- Tailwind CSS
- DaisyUI
- Axios
- React Router DOM
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Development Tools**
- Visual Studio Code
- Git and GitHub
- Postman
- MongoDB

## Project Structure

```text
MediQueue/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HOMEPAGE.jsx
│   │   │   ├── STAFFDASHBOARD.jsx
│   │   │   ├── LOGIN.jsx
│   │   │   └── REGISTER.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

*Note: Adjust the folder structure above to match your actual repository.*

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Anishmnaik/MediQueue.git
```

Navigate into the project:

```bash
cd MediQueue
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Add any other environment variables required by your backend.

Start the backend:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file if required:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/queueapi/generate-token` | Generate a patient token |
| GET | `/queueapi/public-status` | Get public queue information |
| PUT | `/queueapi/advance-queue` | Complete current patient and call next patient |

*Staff authentication is required for protected endpoints.*

## How the System Works

1. Hospital staff log in to the staff dashboard.
2. Staff enter the patient's name and mobile number.
3. The system generates a sequential token number.
4. The patient receives their token number.
5. Patients can check the live queue through the public homepage.
6. Staff complete the current consultation and call the next patient.
7. The queue updates automatically.

## Queue Management Logic

MediQueue uses a common queue for all patients.

Each patient receives a sequential token number. Patients are assigned one of three statuses:

- **Waiting:** Patient is waiting for consultation.
- **Serving:** Patient is currently being consulted.
- **Completed:** Consultation has been completed.

The system uses MongoDB to store patient queue information and maintain token records.

## Future Improvements

- Patient SMS notifications.
- Doctor-specific queues.
- Appointment booking.
- Admin analytics dashboard.
- Improved waiting-time predictions.
- Deployment to a cloud hosting platform.

## Disclaimer

MediQueue is an academic project developed for educational and demonstration purposes. It is not intended to replace a production hospital management system.

## Author

Developed as an academic project using the MERN Stack.

**Project:** MediQueue – Hospital Queue Management System
