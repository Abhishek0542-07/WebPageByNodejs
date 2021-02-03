const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

router.post('/ExpensesDelete', function(req, res) {
    getId(con, req, res);
});


function getId(conn, req, res) {

    var idstore = parseInt(req.body.id) + 1;
    console.log("id : " + idstore);
    var sql = "Select PRIMARY_ID from Expenses_Page where PRIMARY_ID>='" + idstore + "' and MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        if (Object.keys(data).length != 0) {
            getArrayBalance(conn, req, res, data);
        } else {
            doDelete(conn, req, res);
            res.sendStatus(200);
        }
    });
}

function doDelete(con, req, res) {
    var insert_query = "DELETE from Expenses_Page WHERE PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    con.query(insert_query, function(err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
    });
}

function getArrayBalance(conn, req, res, ID_DATA) {
    console.log(ID_DATA);
    var idstore = parseInt(req.body.id) + 1;
    var sql = "Select BALANCE from Expenses_Page where PRIMARY_ID>='" + idstore + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    con.query(sql, function(err, data, fields) {
        console.log(data);
        if (req.body.selelctmethod == 'Debit') {
            getDebitAmount(conn, req, res, ID_DATA, data);

        } else if (req.body.selelctmethod == 'Credit') {
            getCreditAmount(conn, req, res, ID_DATA, data);
        }
    });
}

function getDebitAmount(conn, req, res, ID_DATA, BALANCE_DATA) {
    var sql = "Select Debit from Expenses_Page where PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        if (Object.keys(data).length != 0) {
            doDelete(conn, req, res);
            for (let index = 0; index < Object.keys(ID_DATA).length; index++) {
                var parseBalanceInt = parseInt(BALANCE_DATA[index].BALANCE) + parseInt(data[0].Debit);
                var parseIdInt = parseInt(ID_DATA[index].PRIMARY_ID);

                console.log("id : " + parseIdInt + " = bal : " + parseBalanceInt);
                doUpdateBalance(conn, parseIdInt, parseBalanceInt, req.body.month, req.body.year);
                doIdUpdate(conn, ID_DATA[index].PRIMARY_ID, parseInt(ID_DATA[index].PRIMARY_ID) - 1, req.body.month, req.body.year);
            }
            res.sendStatus(200);
        } else {
            console.log("id not exit");
        }
    });
}

function getCreditAmount(conn, req, res, ID_DATA, BALANCE_DATA) {
    var sql = "Select Credit from Expenses_Page where PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        if (Object.keys(data).length != 0) {
            doDelete(conn, req, res);
            for (let index = 0; index < Object.keys(ID_DATA).length; index++) {
                var parseBalanceInt = parseInt(BALANCE_DATA[index].BALANCE) - parseInt(data[0].Credit);
                var parseIdInt = parseInt(ID_DATA[index].PRIMARY_ID);
                doUpdateBalance(conn, parseIdInt, parseBalanceInt, req.body.month, req.body.year);
                doIdUpdate(conn, ID_DATA[index].PRIMARY_ID, parseInt(ID_DATA[index].PRIMARY_ID) - 1, req.body.month, req.body.year);
            }
            res.sendStatus(200);
        } else {
            console.log("id not exit");
        }
    });
}

function doIdUpdate(conn, PREVIOUS_ID, CURRENT_ID, month, year) {
    var sql = "UPDATE Expenses_Page SET PRIMARY_ID='" + CURRENT_ID + "' WHERE PRIMARY_ID='" + PREVIOUS_ID + "' AND MONTH='" + month + "' AND YEAR='" + year + "'";
    conn.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
}

function doUpdateBalance(conn, id, balance, month, year) {
    var sql = "UPDATE Expenses_Page SET BALANCE='" + balance + "' WHERE PRIMARY_ID='" + id + "' AND MONTH='" + month + "' AND YEAR='" + year + "'";
    conn.query(sql, function(err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
}

module.exports = router;