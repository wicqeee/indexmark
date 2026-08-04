# Index Mark Calculator

- A website that allows Plus Two students to calculate their college index mark based on their subject marks.it is built using **HTML, CSS, JavaScript, Node.js, Express.js, and MySQL**.

- ( This is my college project which i made on my fith semester, So it may have some bugs, mistakes, or areas that can be improved. Sorry if you find any issues, and thank you for your understanding. )

---
## Features

### Student
- Create new account
- Login with that credentials
- Select the stream
- Enter your marks 
- Base on your marks it will show your result (indexmark)

### Admin
- Admin login
- View student details
- Admin can edit their marks if that required
- The dashboard shows how many students are submitted marks 
- It shows Highest index mark , Average index mark and Lowest index mark

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL
- phpMyAdmin (XAMPP)

---

## Project Structure

```text
├── indexmark
│   ├── database
│   │   └── indexmark.sql
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   ├── pages
│   │   ├── admindashboard.html
│   │   ├── adminlogin.html
│   │   ├── editstudent.html
│   │   ├── entermarks.html
│   │   ├── index.html
│   │   ├── js
│   │   │   └── theme.js
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── result.html
│   │   ├── selectstream.html
│   │   └── style.css
│   └── server.js
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/wicqeee/indexmark.git
cd indexmark
```

---

### 2. Install dependencies

```bash
npm install
```

This command automatically installs all packages listed in `package.json`. so you don't actually need to install each dependencies separately using npm command

---

### 3. Start XAMPP

Start XAMPP (windows)

- Apache
- MySQL

Start XAMPP (linux-arch)

```bash
cd /opt/lampp
sudo ./lamp start
```

---

## Database Setup

### Create a database

Open **phpMyAdmin** and create a database named:

```text
indexmark
```

---

### Import the SQL file

Import:

```text
indexmark/database/indexmark.sql
```

This will automatically create required tables:

- students
- marks
- admin

---

## Run the Project

Start the server:

```bash
cd ~/Documents/indexmark # cd into you project directory
node server.js # then run this command basically this will run the file server.js inside our indexmark file so you really want to make sure you in in correct directory 
```

Open this link in your browser:

```text
http://localhost:3000
```

---

## Admin Credentials

you can change the username and password after importing the sql database , you can edit those in **admin** table,default it will be username="admin" , password="admin123"

---

## Screenshots

### Home

*(Add screenshot here)*

---

### Registration

*(Add screenshot here)*

---

### Login

*(Add screenshot here)*

---

### Stream Selection

*(Add screenshot here)*

---

### Enter Marks

*(Add screenshot here)*

---

### Result

*(Add screenshot here)*

---

### Admin Login

*(Add screenshot here)*

---

### Admin Dashboard

*(Add screenshot here)*

---

### Future Improvements

- Password hashing using bcrypt
- Session-based authentication
- Responsive mobile design
- Search and filter students
- Export results as PDF
- Improved UI/UX

---

### 📄 Note

This project was developed for educational and learning purposes as part of a college project.
