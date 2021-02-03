const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

router.post('/ImportExceltoDB', function(req, res) {

    var sql = "SELECT PRIMARY_ID FROM Expenses_Page where PRIMARY_ID='1' and MONTH='" + req.body.month + "' and YEAR='" + req.body.year + "'";
    con.query(sql, function(err, data, fields) {

        if (Object.keys(data).length != 0) {
            doInsertDB(con, req, res);
        } else {
            var insert_query = "INSERT INTO Expenses_Page values('1','" + req.body.StartingDate + "','Empty','Empty','Empty','0','0','" +
                req.body.Textvalue + "','" + req.body.month + "','" + req.body.year + "','Empty','" + req.body.insertdatetime + " ')";
            con.query(insert_query, function(err, data, fields) {
                doInsertDB(con, req, res);
            });
        }
    });
});


async function doInsertDB(con, req, res) {

    var balancearray = [];
    var ALL_DATA_STORE_JSON = [];
    if (req.body.GetMethodofPayment[0] == 'Debit') {
        var minus = parseInt(req.body.Textvalue) - parseInt(req.body.GetDebitAmount[0]);
        balancearray.push(minus);
    } else if (req.body.GetMethodofPayment[0] == 'Credit') {
        var minus = parseInt(req.body.Textvalue) + parseInt(req.body.GetDebitAmount[0]);
        balancearray.push(minus);
    }
    // console.log(balancearray[0]);

    for (var index = 1; index < req.body.id.length; index++) {
        if (req.body.GetMethodofPayment[index] == 'Debit') {
            var minus = parseInt(balancearray[index - 1]) - parseInt(req.body.GetDebitAmount[index]);
            balancearray.push(minus);
            // console.log(req.body.id[index] + " : " + req.body.GetDebitAmount[index] + " : " + minus);
        } else if (req.body.GetMethodofPayment[index] == 'Credit') {
            var minus = parseInt(balancearray[index - 1]) + parseInt(req.body.GetCreditAmount[index]);
            balancearray.push(minus);
            // console.log(req.body.id[index] + " : " + req.body.GetCreditAmount[index] + " : " + minus);
        }
    }
    for (var index = 0; index < balancearray.length; index++) {
        ALL_DATA_STORE_JSON.push(new Array(req.body.id[index], req.body.GetDate[index],
            req.body.GetMethodofPayment[index], req.body.GetPaidTo[index], req.body.GetDescription[index],
            req.body.GetDebitAmount[index], req.body.GetCreditAmount[index], balancearray[index],
            req.body.GetSubTitle[index], req.body.month, req.body.year, req.body.insertdatetime));
    }
    finallyInsert(con, req, res, ALL_DATA_STORE_JSON);
}

async function finallyInsert(con, req, res, ALL_DATA_STORE_JSON) {

    var insert_query = "INSERT INTO Expenses_Page (PRIMARY_ID,DATE_OF_PAYMENT,METHOD_OF_PAYMENT,PAID_TO,DESCRIPTION,DEBIT,CREDIT,BALANCE,SUBTITLE,MONTH,YEAR,INSERT_DATE_TIME) VALUES ?";
    con.query(insert_query, [ALL_DATA_STORE_JSON], function(err, result) {
        console.log("Number of records insert row : " + result.affectedRows);
        res.sendStatus(200);
    });
}

module.exports = router;