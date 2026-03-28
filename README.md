# 🔄 SkillSwap Backend API

**Peer-to-Peer Skill Exchange Platform (Ongoing Project)**

SkillSwap is a backend system designed for a platform where users can **exchange skills, request sessions, and collaborate with others**. This project focuses on building scalable APIs to support user interaction and session management.

---

## 🚀 Features

* 👤 User authentication and management
* 🔁 Send, accept, and reject skill exchange requests
* 📅 Session handling and scheduling *(in progress)*
* 💬 Backend support for real-time chat *(planned)*
* 🔗 RESTful API architecture

---

## ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**

---

## 📁 Project Structure

```bash
Skillswap_Backend/
│── models/        # Database schemas
│── routes/        # API routes
│── controllers/   # Business logic
│── config/        # Database configuration (MongoDB connection)
│── middleware/    # Auth / validation middleware (if added)
│── server.js      # Entry point
```

---

## ⚙️ Configuration (IMPORTANT)

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Then install dotenv:

```bash
npm install dotenv
```

And add this in your `server.js`:

```js
require("dotenv").config();
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Manjukarwasraa/Skillswap_Backend.git
cd Skillswap_Backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the server

```bash
npm start
```

---

## 🔗 API Capabilities

* User APIs (Register / Login)
* Skill request APIs (Send / Accept / Reject)
* Session APIs *(in progress)*

---

## ⚠️ Project Status

🚧 This project is currently under development.
Core backend functionalities are implemented, and advanced features like **session workflows and real-time chat** are being enhanced.

---

## 🌱 Future Improvements

* Real-time chat using **Socket.io**
* Advanced session scheduling
* Notification system
* Role-based access control

---

## 👩‍💻 Contribution

* Worked as **Backend Developer (Team Lead)**
* Designed API structure and handled core backend logic
* Implemented request handling and user management APIs

---

## 👩‍💻 Author

**Manju Karwasra**

* GitHub: https://github.com/Manjukarwasraa

---

## ⭐ Contribute

Feel free to fork this repository and contribute!
