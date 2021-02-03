var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

module.exports = con;