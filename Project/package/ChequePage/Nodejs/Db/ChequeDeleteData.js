const express = require('express');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

module.exports.ChequeDeleteData = function(req, res) {
    getId(con, req, res);
};


function getId(conn, req, res) {
    var idstore = parseInt(req.body.id) + 1;
    var sql = "Select PRIMARY_ID from Cheque_Page where PRIMARY_ID>='" + idstore + "' and month='" + req.body.month + "' AND year='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        doDelete(conn, req, res, data);
        res.sendStatus(200);
    });
}

function doDelete(con, req, res, ID_DATA) {
    var insert_query = "DELETE from Cheque_Page WHERE PRIMARY_ID='" + req.body.id + "' AND month='" + req.body.month + "' AND year='" + req.body.year + "'";
    con.query(insert_query, function(err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        for (let index = 0; index < Object.keys(ID_DATA).length; index++) {
            doIdUpdate(con, ID_DATA[index].PRIMARY_ID, parseInt(ID_DATA[index].PRIMARY_ID) - 1, req.body.month, req.body.year);
        }
    });
}

function doIdUpdate(conn, PREVIOUS_ID, CURRENT_ID, month, year) {
    var sql = "UPDATE Cheque_Page SET PRIMARY_ID='" + CURRENT_ID + "' WHERE PRIMARY_ID='" + PREVIOUS_ID + "' AND month='" + month + "' AND year='" + year + "'";
    conn.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
}