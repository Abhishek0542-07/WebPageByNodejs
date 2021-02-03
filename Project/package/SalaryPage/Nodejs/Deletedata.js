const express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

module.exports.DeleteData = function(req, res) {
    getId(con, req, res);
};


function getId(conn, req, res) {
    var idstore = parseInt(req.body.id) + 1;
    var sql = "Select PRIMARY_KEY from Salary_Page where PRIMARY_KEY>='" + idstore + "' and month='" + req.body.month + "' AND year='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        doDelete(conn, req, res, data);
        res.sendStatus(200);
    });
}

function doDelete(con, req, res, ID_DATA) {
    var insert_query = "DELETE from Salary_Page WHERE PRIMARY_KEY='" + req.body.id + "' AND month='" + req.body.month + "' AND year='" + req.body.year + "'";
    con.query(insert_query, function(err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        for (let index = 0; index < Object.keys(ID_DATA).length; index++) {
            doIdUpdate(con, ID_DATA[index].PRIMARY_KEY, parseInt(ID_DATA[index].PRIMARY_KEY) - 1, req.body.month, req.body.year);
        }
    });
}

function doIdUpdate(conn, PREVIOUS_ID, CURRENT_ID, month, year) {
    var sql = "UPDATE Salary_Page SET PRIMARY_KEY='" + CURRENT_ID + "' WHERE PRIMARY_KEY='" + PREVIOUS_ID + "' AND month='" + month + "' AND year='" + year + "'";
    conn.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
}