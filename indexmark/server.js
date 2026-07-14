const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "pages")));

// Registration route
app.post("/register", (req, res) => {

    const { name, phone, username, password } = req.body;

    const sql = `
        INSERT INTO students (name, phone, username, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, phone, username, password], (err, result) => {

        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    message: "Username already exists."
                });
            }
            console.error(err);

            return res.status(500).json({
                message: "Registration failed."
            });
        }


        res.json({
            message: "Student registered successfully!",
            studentId: result.insertId
        });
    });

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});