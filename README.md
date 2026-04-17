# LibraryHub-backend
# 📚 LibraryHub Backend

LibraryHub Backend is a robust and scalable backend system designed for managing library operations efficiently. It provides APIs for handling users, books, borrowing requests, and administrative functionalities.

---

## 🚀 Features

- 👤 User Management (Admin & Members)
- 📖 Book Management (Add, Update, Delete, Search)
- 🔄 Borrow & Return System
- ✅ Request Approval Workflow
- 🔐 Authentication & Authorization
- 📊 Dashboard Data Handling
- 📁 RESTful API Architecture

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Tools:** Postman, Git, VS Code

---

## 📂 Project Structure
<br> <pre>
├── package.json
├── server.js
├───src
│   │   app.js
│   │   index.js
│   ├───config
│   ├───controllers
│   ├───exception
│   ├───middleware
│   ├───models
│   ├───routes
│   └───utils
└───tests
</pre> </br>

---

## 🔑 API Modules

### 👤 User Module
- Register User
- Login User
- Role-based access (Admin / Member)

### 📚 Book Module
- Add new books
- Update book details
- Delete books
- Search & filter books

### 🔄 Borrow Module
- Request book issue
- Approve/Reject requests (Admin)
- Return book handling

---

## 🔄 System Workflow

1. User registers/logs in
2. User searches for books
3. User sends borrow request
4. Admin approves/rejects request
5. User borrows and returns the book

---

## 🧑‍💼 Actors

- **Admin**
  - Manage books
  - Approve/reject requests
  - View system reports

- **Member**
  - Search books
  - Request borrow
  - Return books

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/LibraryHub-backend.git

# Navigate to project
cd LibraryHub-backend

# Install dependencies
npm install

# Run server
npm start