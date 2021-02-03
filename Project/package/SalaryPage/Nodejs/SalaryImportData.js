const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

module.exports.ImportDataDb = function(req, res) {
    doInsertDB(con, req, res);
};

async function doInsertDB(con, req, res) {
    var ALL_DATA_STORE_JSON = [];
    for (var index = 0; index < req.body.id.length; index++) {
        ALL_DATA_STORE_JSON.push(new Array(req.body.id[index], req.body.GetDate[index],
            req.body.GetCustomerName[index], req.body.GetBankName[index], req.body.GetBank_Transfer_Amount[index],
            req.body.GetCheuqe_No[index], req.body.GetCheque_Amount[index],
            req.body.GetAmount_Status[index], req.body.insertdatetime, '', req.body.month, req.body.year));
    }
    finallyInsert(con, res, ALL_DATA_STORE_JSON);
}

async function finallyInsert(con, res, ALL_DATA_STORE_JSON) {
    if (ALL_DATA_STORE_JSON != '') {
        var insert_query = "INSERT INTO Cheque_Page (PRIMARY_ID,Date_Of_Payment,CustomerName,BankName,Bank_Transfer_Amount,Cheuqe_No,Cheque_Amount,Amount_Status,insertDateTime,UpdateTimeDate,month,year) VALUES ?";
        con.query(insert_query, [ALL_DATA_STORE_JSON], function(err, result) {
            console.log("Number of records insert row : " + result.affectedRows);
            res.send("Number of records insert row : " + result.affectedRows);
            res.status(200);
        });
    }
}