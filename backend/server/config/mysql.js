import mysql from 'mysql';

// Set up a mysql connection with required info
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password123",
    database: "expenses"
});

// Make the connection
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
})

// Export our connection for use
export default con;
