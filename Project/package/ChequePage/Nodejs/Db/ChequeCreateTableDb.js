const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const chequedata = require('./ChequeUpdateData.js');
const CHEQUE_IMPORT_DATA_IN_DB = require('./ImportChequeDatadb.js');
const CHEQUE_DELETE_DATA_IN_DB = require('./ChequeDeleteData.js');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

var CREATE_TABLE = "CREATE TABLE Cheque_Page(PRIMARY_ID INT(6),Date_Of_Payment TEXT,CustomerName TEXT,BankName VARCHAR(225),Bank_Transfer_Amount VARCHAR(225),Cheuqe_No TEXT,Cheque_Amount VARCHAR(225),Amount_Status VARCHAR(225),Month TEXT,Year TEXT,insertDateTime VARCHAR(225))";

checkTableExit(con, 'Cheque_Page');

let testData = [];

function checkTableExit(connection, TableName) {
    connection.query('SHOW tables', function(err, tables) {
        tables.forEach(element => {
            testData.push(element.Tables_in_sys)
        });
        if (testData.includes(TableName.toLowerCase())) {
            console.log("exit data");
        } else {
            console.log("not exited");
            con.query(CREATE_TABLE, function(err, result) {
                if (err) throw err;
                con.query(" ALTER TABLE Cheque_Page ADD COLUMN UpdateTimeDate VARCHAR(225)", function(err, data, fields) {});
                console.log("Table created");
            });
        }
    });
}

var month = '';
var year = '';
router.post('/month-year', function(req, res) {
    month = req.body.month;
    year = req.body.year;
    res.sendStatus(200);
});
var columnname = '';
var TEXT_VALUES = '';

router.route("/UpdateData").post(chequedata.UpdateData);
router.route("/ChequeImportData").post(CHEQUE_IMPORT_DATA_IN_DB.ImportDataDb);
router.route("/ChequeDeleteData").post(CHEQUE_DELETE_DATA_IN_DB.ChequeDeleteData);

//Bank_Transfer_Amount,Cheque_Amount
var v = {};
router.get('/getAllAmount', function(req, res) {
    var sql = "SELECT SUM(Bank_Transfer_Amount) as Amount FROM Cheque_Page where month='" + month + "' and year='" + year + "'";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        v = data;
        return new Promise(function(resolve, reject) {
            var sql = "SELECT SUM(Cheque_Amount) as Amount FROM Cheque_Page where month='" + month + "' and year='" + year + "'";
            con.query(sql, function(err, data, fields) {
                if (err) throw err;
                var d = { v, data }
                res.json(d);
                // res.sendStatus(200);
            });
        });
    });
});

router.get('/user-list', function(req, res) {
    var sql = "SELECT * FROM Cheque_Page where month='" + month + "' and year='" + year + "' ";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json(data);
    });
});

router.post('/ChequeInsertData', function(req, res) {
    getId(con, req, res);
});

function getId(conn, req, res) {

    var valid = {};

    var sql = "Select PRIMARY_ID from Cheque_Page where month='" + req.body.month + "' AND year='" + req.body.year + "' ORDER BY PRIMARY_ID DESC LIMIT 1";
    conn.query(sql, function(err, data, fields) {
        if (err) throw err;
        valid = data;
        if (data == '') {
            doInsert(conn, req, res, 0);
        } else {
            doInsert(conn, req, res, valid[0].PRIMARY_ID);
        }

    });
}

function doInsert(con, req, res, id) {
    id = id + 1;
    var insert_query = "INSERT INTO Cheque_Page values('" + id + "','" + req.body.date + "','" +
        req.body.CustomerName + "','" + req.body.BankName + "','" + req.body.Bank_Transfer_Amount + "','" +
        req.body.Cheuqe_No + "','" + req.body.Cheque_Amount + "','" + req.body.Amount_Status + "','" +
        req.body.month + "','" + req.body.year + "','" + req.body.insertdatetime + "','')";
    con.query(insert_query, function(err, result) {
        if (err) throw err;
        console.log('success insert data');
        res.sendStatus(200);
    });
}

module.exports = router;