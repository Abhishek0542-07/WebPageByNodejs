const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const SLALARY_UPDATE_DATA = require('./Updatedata.js');
const SALARY_IMPORT_DATA_IN_DB = require('./SalaryImportData.js');
const SALARY_DELETE_DATA_IN_DB = require('./Deletedata.js');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

var CREATE_TABLE = "CREATE TABLE Salary_Page(PRIMARY_KEY INT(6),DateofInsert TEXT,EMPLOYES_NAME TEXT,Desgination VARCHAR(225),Salary_of_Month TEXT,Convence_Received_Date VARCHAR(225),Convence_Amount VARCHAR(225),Maintance_Amount VARCHAR(225),Advance_Amount VARCHAR(225),Total_Salary_Month VARCHAR(225),Method_of_Status VARCHAR(225),Month TEXT,Year TEXT,insertdatetime VARCHAR(225))";
checkTableExit(con, 'Salary_Page');

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
                con.query(" ALTER TABLE Salary_Page ADD COLUMN UpdateTimeDate VARCHAR(225)", function(err, data, fields) {});
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

router.route("/SalaryUpdateData").post(SLALARY_UPDATE_DATA.UpdateData);
router.route("/SalaryImportData").post(SALARY_IMPORT_DATA_IN_DB.ImportDataDb);
router.route("/SalaryDeleteData").post(SALARY_DELETE_DATA_IN_DB.DeleteData);

//Bank_Transfer_Amount,Cheque_Amount

//PRIMARY_KEY ,DateofInsert ,EMPLOYES_NAME ,Desgination ,Salary_of_Month ,Convence_Received_Date ,Convence_Amount,Maintance_Amount,Advance_Amount,Total_Salary_Month,Method_of_Status
router.get('/getAllAmount', async function(req, res) {
    var v = new Array();
    var sql = "SELECT SUM(Salary_of_Month) as Amount FROM Salary_Page where month='" + month + "' and year='" + year + "'";
    var sql1 = "SELECT SUM(Convence_Amount) as Amount FROM Salary_Page where month='" + month + "' and year='" + year + "'";
    var sql2 = "SELECT SUM(Maintance_Amount) as Amount FROM Salary_Page where month='" + month + "' and year='" + year + "'";
    var sql3 = "SELECT SUM(Advance_Amount) as Amount FROM Salary_Page where month='" + month + "' and year='" + year + "'";
    var sql4 = "SELECT SUM(Total_Salary_Month) as Amount FROM Salary_Page where month='" + month + "' and year='" + year + "'";

    await con.query(sql, function(err, data, fields) {
        if (err) throw err;
        console.log(data[0].Amount);
        v.push(data[0].Amount);

    });
    await con.query(sql1, function(err, data, fields) {
        if (err) throw err;
        console.log(data[0].Amount);
        v.push(data[0].Amount);
    });
    await con.query(sql2, function(err, data, fields) {
        if (err) throw err;
        console.log(data[0].Amount);
        v.push(data[0].Amount);
    });
    await con.query(sql3, function(err, data, fields) {
        if (err) throw err;
        console.log(data[0].Amount);
        v.push(data[0].Amount);
    });
    await con.query(sql4, function(err, data, fields) {
        if (err) throw err;
        console.log(data[0].Amount);
        v.push(data[0].Amount);
        res.json(v);
    });
});

router.get('/user-list', function(req, res) {
    var sql = "SELECT * FROM Salary_Page where month='" + month + "' and year='" + year + "' ";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json(data);
    });
});

router.post('/SalaryInsertData', function(req, res) {
    getId(con, req, res);
});

function getId(conn, req, res) {

    var valid = {};

    var sql = "Select PRIMARY_KEY from Salary_Page where month='" + req.body.month + "' AND year='" + req.body.year + "' ORDER BY PRIMARY_KEY DESC LIMIT 1";
    conn.query(sql, function(err, data, fields) {
        if (err) throw err;
        valid = data;
        if (data == '') {
            doInsert(conn, req, res, 0);
        } else {
            doInsert(conn, req, res, valid[0].PRIMARY_KEY);
        }

    });
}

function doInsert(con, req, res, id) {
    id = id + 1;

    var insert_query = "INSERT INTO Salary_Page values('" + id + "','" + req.body.date + "','" +
        req.body.EMPLOYES_NAME + "','" + req.body.Designation + "','" + req.body.Salary_of_Month + "','" +
        req.body.Convence_Received_Date + "','" + req.body.Convence_Amount + "','" + req.body.Maintance_Amount + "','" +
        req.body.Advance_Amount + "','" + req.body.Total_Salary_Month + "','" + req.body.amountstatus + "','" +
        req.body.month + "','" + req.body.year + "','" + req.body.insertdatetime + "','')";
    con.query(insert_query, function(err, result) {
        if (err) throw err;
        console.log('success insert data');
        res.sendStatus(200);
    });
}

module.exports = router;