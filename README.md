# S A Raichur Service Point - Full-Stack Application

A premium, production-quality service marketplace web application for **S A Raichur Service Point** inspired by the convenience and visual layout of **Urban Company**. It is built using the React, Redux Toolkit, Tailwind CSS, Express, and MongoDB tech stack.

---

## 🚀 Key Features

* **Urban Company Inspired UX**: Sticky navigation, location badges, search autocomplete matching, category rows, horizontal scroll slides, and detailed service descriptions.
* **Redux Toolkit Cart System**: Global cart management handling item quantities and automatic price summaries (persisted in LocalStorage).
* **REST API backend**: Node.js & Express endpoints processing bookings and admin authentication securely.
* **Persistent Database (MongoDB)**: Mongoose schemas storing catalog items, bookings, and admin users.
* **Mock Database Fallback**: If MongoDB is not connected, the server automatically reads and writes bookings to a local file (`server/data/bookings_atlas_mock.json`), guaranteeing the app is immediately testable offline.
* **JWT Admin Dashboard**: Authentication utilizing JWT tokens and bcrypt password hashing. Admin panels display charts and status update dropdowns (`New`, `Contacted`, `Confirmed`, `Completed`, `Cancelled`).
* **Email Notifications**: Triggers SMTP nodemailer emails alerting the admin office of incoming bookings.
* **Indian Market Action Triggers**: Instant click-to-call links and WhatsApp redirect links with pre-filled service sheets.

---

## 📂 Folder Layout

```text
├── client/                     # Vite + React Frontend SPA
│   ├── src/
│   │   ├── components/         # Reusable widgets (Navbar, Footer, WhyChooseUs, etc.)
│   │   ├── data/               # Local static catalog backup
│   │   ├── pages/              # SPA Routing components (Home, Details, Cart, Admin, etc.)
│   │   ├── redux/              # Store configurations and slices (cart, auth, booking)
│   │   ├── services/           # Async API fetch handlers
│   │   ├── App.jsx             # Routes wrapper and Protected routes
│   │   └── main.jsx            # Redux Provider entrypoint
│   └── tailwind.config.js      # Custom theme definitions
│
├── server/                     # Node/Express Backend API
│   ├── config/                 # Mongoose connections
│   ├── controllers/            # Logic handlers (Auth, Bookings, Services)
│   ├── data/                   # Default seeds list and mock database files
│   ├── middleware/             # JWT decoders and error formatters
│   ├── models/                 # Mongoose database schemas
│   ├── routes/                 # REST path route definitions
│   └── server.js               # Entry script
│
├── .env.example                # Template settings file
└── package.json                # Workspace runner configurations
```

---

## ⚙️ Configuration & Environment Setup

1. In the root directory, copy `.env.example` to create a `.env` file:
   ```bash
   copy .env.example .env
   ```
2. Open `.env` and fill in your connection variables (such as `MONGODB_URI` and SMTP email keys).
3. **Mock Mode Note**: If you do not provide a `MONGODB_URI` database string, the app will run in **Mock Mode**, storing details in `server/data/bookings_atlas_mock.json`.

---

## 🛠️ Quick Start Instructions

1. **Install All Dependencies**: Run the workspace installer in the root folder to download node packages for both frontend and backend directories:
   ```bash
   npm run install-all
   ```
2. **Start Dev Servers**: Spin up both the Express API (port 5000) and the Vite frontend (port 5173 with proxy configuration) concurrently:
   ```bash
   npm run dev
   ```
   * Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Log in to Admin Dashboard**:
   * Visit: [http://localhost:5173/login](http://localhost:5173/login) (or click the lock icon in the top right).
   * Note: The first login attempt will dynamically register the administrator credentials of your choice in the database.

---

## 📦 Production Compilation

To bundle the React frontend and run everything from the Express backend on a single port (port 5000):

1. Compile the React build assets into `client/dist`:
   ```bash
   npm run build-client
   ```
2. Start the Express server:
   ```bash
   npm start --prefix server
   ```
   * Open [http://localhost:5000](http://localhost:5000) in your browser.
