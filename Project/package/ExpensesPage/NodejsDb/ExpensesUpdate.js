const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

router.post('/ExpensesUpdate', function(req, res) {
    getId(con, req, res);
});

function getId(conn, req, res) {

    var sql = "Select PRIMARY_ID from Expenses_Page where PRIMARY_ID>='" + req.body.id + "' and MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        if (Object.keys(data).length != 0) {
            getArrayBalance(conn, req, res, data);
            getUpdateMoreData(conn, req, res);
        }
    });
}

function getUpdateMoreData(conn, req, res) {
    var arrayupdate = [req.body.DATE_OF_PAYMENT, req.body.METHOD_OF_PAYMENT, req.body.PAID_TO, req.body.DESCRIPTION];

    var DATE_OF_PAYMENT_SELECT = "Select DATE_OF_PAYMENT,PAID_TO,DESCRIPTION from Expenses_Page where PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";

    conn.query(DATE_OF_PAYMENT_SELECT, function(err, data, fields) {
        var update = "UPDATE Expenses_Page SET DATE_OF_PAYMENT=? , METHOD_OF_PAYMENT=? , PAID_TO=? ,DESCRIPTION=? WHERE PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
        conn.query(update, arrayupdate, function(error, result, rows, fields) {
            res.sendStatus(200);
        });
    });
}

function getArrayBalance(conn, req, res, ID_DATA) {
    console.log(ID_DATA);
    var sql = "Select BALANCE from Expenses_Page where PRIMARY_ID>='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    con.query(sql, function(err, data, fields) {
        if (req.body.METHOD_OF_PAYMENT == 'Debit') {
            getDebitAmount(conn, req, res, ID_DATA, data);
        } else if (req.body.METHOD_OF_PAYMENT == 'Credit') {
            getCreditAmount(conn, req, res, ID_DATA, data);
        }
    });
}

function getDebitAmount(conn, req, res, ID_DATA, BALANCE_DATA) {
    var GET_INPUT_AMOUNT = 0;
    var BALANCE_ARRAY = [];
    var ID_ARRAY = [];

    var sql = "Select DEBIT from Expenses_Page where PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        if (Object.keys(data).length != 0) {

            doUpdateDebit(conn, req.body.id, parseInt(req.body.amount), req.body.month, req.body.year);

            if (parseInt(req.body.amount) > parseInt(data[0].DEBIT)) {
                GET_INPUT_AMOUNT = parseInt(req.body.amount) - parseInt(data[0].DEBIT);
            } else {
                GET_INPUT_AMOUNT = parseInt(data[0].DEBIT) - parseInt(req.body.amount);
            }

            if (req.body.amount != data[0].DEBIT) {
                for (let index = 0; index < Object.keys(ID_DATA).length; index++) {
                    var parseBalanceInt = parseInt(BALANCE_DATA[index].BALANCE) + parseInt(GET_INPUT_AMOUNT);
                    var parseIdInt = parseInt(ID_DATA[index].PRIMARY_ID);
                    BALANCE_ARRAY.push(parseBalanceInt);
                    ID_ARRAY.push(parseIdInt);
                }
                doUpdateBalance(conn, ID_ARRAY, BALANCE_ARRAY, req.body.month, req.body.year);
                res.sendStatus(200);
            }

        } else {
            console.log("id not exit");
        }
    });
}

function getCreditAmount(conn, req, res, ID_DATA, BALANCE_DATA) {
    var GET_INPUT_AMOUNT = 0;
    var BALANCE_ARRAY = [];
    var ID_ARRAY = [];

    var sql = "Select CREDIT from Expenses_Page where PRIMARY_ID='" + req.body.id + "' AND MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {
        if (Object.keys(data).length != 0) {
            if (req.body.amount != data[0].CREDIT) {

                doUpdateCredit(conn, req.body.id, parseInt(req.body.amount), req.body.month, req.body.year);

                if (parseInt(req.body.amount) > parseInt(data[0].CREDIT)) {
                    GET_INPUT_AMOUNT = parseInt(req.body.amount) - parseInt(data[0].CREDIT);
                } else {
                    GET_INPUT_AMOUNT = parseInt(data[0].CREDIT) - parseInt(req.body.amount);
                }

                for (let index = 0; index < Object.keys(ID_DATA).length; index++) {

                    var parseBalanceInt = parseInt(BALANCE_DATA[index].BALANCE) + parseInt(GET_INPUT_AMOUNT);
                    var parseIdInt = parseInt(ID_DATA[index].PRIMARY_ID);
                    BALANCE_ARRAY.push(parseBalanceInt);
                    ID_ARRAY.push(parseIdInt);
                }
                doUpdateBalance(conn, ID_ARRAY, BALANCE_ARRAY, req.body.month, req.body.year);
                res.sendStatus(200);
            }
        } else {
            console.log("id not exit");
        }
    });
}
// PRIMARY_ID INT(6),DATE_OF_PAYMENT TEXT,METHOD_OF_PAYMENT TEXT,PAID_TO VARCHAR(225),DESCRIPTION TEXT,DEBIT VARCHAR(225),CREDIT VARCHAR(225),BALANCE VARCHAR(225),MONTH TEXT,YEAR TEXT,SUBTITLE TEXT,INSERT_DATE_TIME VARCHAR(225)

function doUpdateDebit(conn, id, debitamount, month, year) {
    var sql = "UPDATE Expenses_Page SET DEBIT='" + debitamount + "' WHERE PRIMARY_ID='" + id + "' AND MONTH='" + month + "' AND YEAR='" + year + "'";
    conn.query(sql, function(error, result, fields) {
        if (error) throw error;
        console.log(result.affectedRows + " record(s) updated");
    });
}

function doUpdateCredit(conn, id, creditamount, month, year) {
    var sql = "UPDATE Expenses_Page SET CREDIT='" + creditamount + "' WHERE PRIMARY_ID='" + id + "' AND MONTH='" + month + "' AND YEAR='" + year + "'";
    conn.query(sql, function(error, result, fields) {
        if (error) throw error;
        console.log(result.affectedRows + " record(s) updated");
    });
}

function doUpdateBalance(conn, id, updatebalance, month, year) {
    for (var index = 0; index < id.length; index++) {
        var sql = "UPDATE Expenses_Page SET BALANCE='" + updatebalance[index] + "' WHERE PRIMARY_ID='" + id[index] + "' AND MONTH='" + month + "' AND YEAR='" + year + "'";
        conn.query(sql, function(error, result, fields) {
            console.log(result.affectedRows + " record(s) updated");
        });
    }

}

module.exports = router;