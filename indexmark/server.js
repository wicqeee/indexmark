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


//this for login 

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT *
        FROM students
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, password], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Login failed."
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        const student = results[0];

        const checkMarksSql = `
    SELECT id
    FROM marks
    WHERE student_id = ?
`;

        db.query(checkMarksSql, [student.id], (err, markResults) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Login failed."
                });
            }

            res.json({
                message: "Login successful!",
                studentId: student.id,
                stream: student.stream,
                hasMarks: markResults.length > 0
            });

        });

    });

});

// this is for the stream submission

app.post("/submit-stream", (req, res) => {

    const { studentId, stream } = req.body;

    const sql = `
        UPDATE students
        SET stream = ?
        WHERE id = ?
    `;

    db.query(sql, [stream, studentId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Could not save stream."
            });
        }

        res.json({
            message: "Stream saved successfully!"
        });

    });

});


// student id check
app.get("/student/:id", (req, res) => {

    const studentId = req.params.id;

    const sql = `
        SELECT id, name, stream
        FROM students
        WHERE id = ?
    `;

    db.query(sql, [studentId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json(results[0]);

    });

});

// submit marks 
app.post("/submit-marks", (req, res) => {

    const { studentId, marks } = req.body;

    // First check if marks already exist
    const checkSql = `
        SELECT *
        FROM marks
        WHERE student_id = ?
    `;

    db.query(checkSql, [studentId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        // Student already submitted marks
        if (results.length > 0) {
            return res.status(400).json({
                message: "You have already submitted your marks."
            });
        }

        // Calculate index mark
        const values = Object.values(marks);

        const indexMark =
            values.reduce((sum, mark) => sum + mark, 0) / values.length;

        const insertSql = `
            INSERT INTO marks (
                student_id,
                botany,
                zoology,
                mathematics,
                physics,
                chemistry,
                computer_science,
                informatics_practices,
                accountancy,
                business_studies,
                economics,
                index_mark
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const data = [

            studentId,

            marks.botany || null,
            marks.zoology || null,
            marks.mathematics || null,
            marks.physics || null,
            marks.chemistry || null,

            marks.computer_science || null,

            marks.informatics_practices || null,
            marks.accountancy || null,
            marks.business_studies || null,
            marks.economics || null,

            indexMark

        ];

        db.query(insertSql, data, (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Could not save marks."
                });
            }

            res.json({
                message: "Marks saved successfully!",
                indexMark
            });

        });

    });

});


// getting student result 

app.get("/result/:studentId", (req, res) => {

    const studentId = req.params.studentId;

    const sql = `
        SELECT
            students.name,
            students.stream,
            marks.*
        FROM students
        JOIN marks
        ON students.id = marks.student_id
        WHERE students.id = ?
        ORDER BY marks.id DESC
        LIMIT 1
    `;

    db.query(sql, [studentId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No result found."
            });
        }

        res.json(results[0]);

    });

});

// so this is for the marks already exist or not 

app.get("/has-marks/:studentId", (req, res) => {

    const studentId = req.params.studentId;

    const sql = `
        SELECT id
        FROM marks
        WHERE student_id = ?
    `;

    db.query(sql, [studentId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        res.json({
            hasMarks: results.length > 0
        });

    });

});


// for the admin login route 

app.post("/admin-login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT *
        FROM admin
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, password], (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Login failed."
            });

        }

        if (results.length === 0) {

            return res.status(401).json({
                message: "Invalid username or password."
            });

        }

        res.json({
            message: "Admin login successful!"
        });

    });

});

// so this will show the student marks to the admin page 

app.get("/admin/students", (req, res) => {

    const stream = req.query.stream;
    const sort = req.query.sort || "desc";
    const search = req.query.search || "";

    let sql = `
        SELECT
            students.id,
            students.name,
            students.username,
            students.phone,
            students.stream,
            marks.index_mark AS indexMark
        FROM students
        LEFT JOIN marks
        ON students.id = marks.student_id
    `;

    const values = [];

    let conditions = [];

    if (stream && stream !== "all") {

        conditions.push("students.stream = ?");

        values.push(stream);

    }

    if (search) {

        conditions.push("students.name LIKE ?");

        values.push(`%${search}%`);

    }

    if (conditions.length > 0) {

        sql += " WHERE " + conditions.join(" AND ");

    }

    sql += ` ORDER BY indexMark ${sort === "asc" ? "ASC" : "DESC"}`;

    db.query(sql, values, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });

        }

        const students = results;

        const indexes = students
            .filter(s => s.indexMark !== null)
            .map(s => Number(s.indexMark));

        const stats = {

            totalStudents: students.length,

            highestIndex: indexes.length
                ? Math.max(...indexes)
                : 0,

            lowestIndex: indexes.length
                ? Math.min(...indexes)
                : 0,

            averageIndex: indexes.length
                ? (
                    indexes.reduce((a, b) => a + b, 0) /
                    indexes.length
                ).toFixed(2)
                : 0

        };

        res.json({

            students,
            stats

        });

    });

});


// we use this for editing the student data only for the admin 

// Get one student's details
app.get("/admin/student/:id", (req, res) => {

    const studentId = req.params.id;

    const sql = `
        SELECT
            students.id,
            students.name,
            students.stream,
            marks.*
        FROM students
        LEFT JOIN marks
        ON students.id = marks.student_id
        WHERE students.id = ?
    `;

    db.query(sql, [studentId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Student not found."
            });
        }

        res.json(results[0]);

    });

});

// Update student marks (Admin)
app.put("/admin/student/:id", (req, res) => {

    const studentId = req.params.id;
    const { marks } = req.body;

    // Calculate new index mark
    const values = Object.values(marks);
    const indexMark =
        values.reduce((sum, mark) => sum + mark, 0) / values.length;

    const sql = `
        UPDATE marks
        SET
            botany = ?,
            zoology = ?,
            mathematics = ?,
            physics = ?,
            chemistry = ?,
            computer_science = ?,
            informatics_practices = ?,
            accountancy = ?,
            business_studies = ?,
            economics = ?,
            index_mark = ?
        WHERE student_id = ?
    `;

    const data = [

        marks.botany || null,
        marks.zoology || null,
        marks.mathematics || null,
        marks.physics || null,
        marks.chemistry || null,
        marks.computer_science || null,
        marks.informatics_practices || null,
        marks.accountancy || null,
        marks.business_studies || null,
        marks.economics || null,

        indexMark,

        studentId

    ];

    db.query(sql, data, (err) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Could not update marks."
            });
        }

        res.json({
            message: "Marks updated successfully!"
        });

    });

});