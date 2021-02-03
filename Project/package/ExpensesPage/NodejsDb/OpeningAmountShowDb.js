const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

router.post('/ExpenseAddOpening', function(req, res) {
    getId(con, req);
    res.sendStatus(200);
});

function getId(conn, req) {

    var valid = {};
    var sql = "Select PRIMARY_ID from Expenses_Page where MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "' ORDER BY PRIMARY_ID DESC LIMIT 1";
    conn.query(sql, function(err, data, fields) {
        if (err) throw err;
        valid = data;
        if (valid != '') {
            doInsert(conn, req, valid[0].PRIMARY_ID);
        } else {
            console.log("data not exited");
            doInsert(conn, req, 0);
        }
    });
}

function doInsert(con, req, id) {
    id = id + 1;
    var insert_query = "INSERT INTO Expenses_Page values('" + id + "','" + req.body.date + "','Empty','Empty','Empty','0','0','" + req.body.amount + "','" + req.body.month + "','" + req.body.year + "','Empty','" + req.body.insertdatetime + "')";
    con.query(insert_query, function(err, result) {
        if (err) throw err;
        console.log('success insert data');
    });
}
module.exports = router;