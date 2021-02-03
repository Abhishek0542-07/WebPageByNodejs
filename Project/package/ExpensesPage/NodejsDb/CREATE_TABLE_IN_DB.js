const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var data = { id: '1', fname: 'Abhishek', lname: 'Singh' }
router
    .get('/expensepagedatainsert', function(req, res) {
        res.json(data);
    });

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

var CREATE_TABLE = "CREATE TABLE Expenses_Page(PRIMARY_ID INT(6),DATE_OF_PAYMENT TEXT,METHOD_OF_PAYMENT TEXT,PAID_TO VARCHAR(225),DESCRIPTION TEXT,DEBIT VARCHAR(225),CREDIT VARCHAR(225),BALANCE VARCHAR(225),MONTH TEXT,YEAR TEXT,SUBTITLE TEXT,INSERT_DATE_TIME VARCHAR(225))";

checkTableExit(con, 'Expenses_Page');

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

router.post('/postOpeningAmountShow', function(req, res) {
    columnname = req.body.COLNUM_NAME;
    TEXT_VALUES = req.body.Text_Amount;
    month = req.body.month;
    year = req.body.year;

});
router.get('/getOpeningAmountShow', function(req, res) {

    var datareturn = { TEXT_VALUES: TEXT_VALUES };
    var sql = "SELECT SUM(" + columnname.toUpperCase() + ") as totalamount FROM Expenses_Page where  MONTH='" + month + "' and YEAR='" + year + "'";
    console.log(sql);

    if (columnname != "Cheque" && month != '' && year != '') {
        con.query(sql, function(err, data, fields) {
            console.log(data);
            datareturn['Amount'] = data[0].totalamount;
            res.json(datareturn);
        });
    }
});

router.get('/getCurrentOpeningAmount', function(req, res) {
    var sql = "SELECT BALANCE FROM Expenses_Page where MONTH='" + month + "' and YEAR='" + year + "' GROUP BY PRIMARY_ID HAVING COUNT(SUBTITLE)>0";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json(data);
    });
});


router.get('/getsubtitle', function(req, res) {
    var sql = "SELECT SUBTITLE FROM Expenses_Page where MONTH='" + month + "' and YEAR='" + year + "' GROUP BY SUBTITLE HAVING COUNT(SUBTITLE)>0";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json(data);
    });
});

router.get('/user-list', function(req, res) {
    var sql = "SELECT * FROM Expenses_Page where MONTH='" + month + "' and YEAR='" + year + "' ";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json(data);
    });
});

router.get('/getOpeningAmount', function(req, res) {
    var sql = "SELECT BALANCE FROM Expenses_Page where MONTH='" + month + "' and YEAR='" + year + "'";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json(data);
        // res.sendStatus(200);
    });
});

router.post('/Expensesinsert', function(req, res) {
    getId(con, req, res);
});

function getBalance(conn, req, res, id) {
    var valid = {};
    id = id + 1;
    var sql = "Select BALANCE from Expenses_Page where MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "' ORDER BY PRIMARY_ID DESC LIMIT 1";
    conn.query(sql, function(err, data, fields) {
        if (err) throw err;
        if (req.body.methodofincome == 'Debit') {
            var bal = parseInt(data[0].BALANCE) - parseInt(req.body.amount);

            var insert_query = "INSERT INTO Expenses_Page values('" + id + "','" + req.body.date + "','" +
                req.body.methodofincome + "','" + req.body.paid_to + "','" + req.body.description + "','" +
                req.body.amount + "','0','" + bal + "','" + req.body.month + "','" + req.body.year + "','" + req.body.subtitle + "','" + req.body.insertdatetime + "')";

            con.query(insert_query, function(err, result) {
                if (err) throw err;
                console.log('success insert data');
                res.sendStatus(200);

            });
        } else if (req.body.methodofincome == 'Credit') {
            var bal = parseInt(data[0].BALANCE) + parseInt(req.body.amount);

            var insert_query = "INSERT INTO Expenses_Page values('" + id + "','" + req.body.date + "','" +
                req.body.methodofincome + "','" + req.body.paid_to + "','" + req.body.description + "','0','" +
                req.body.amount + "','" + bal + "','" + req.body.month + "','" + req.body.year + "','" + req.body.subtitle + "','" + req.body.insertdatetime + "')";
            con.query(insert_query, function(err, result) {
                if (err) throw err;
                res.sendStatus(200);

            });

        } else {}
    });
}

function getId(conn, req, res) {
    var valid = {};
    var sql = "Select PRIMARY_ID from Expenses_Page where MONTH='" + req.body.month + "' AND YEAR='" + req.body.year + "' ORDER BY PRIMARY_ID DESC LIMIT 1";
    conn.query(sql, function(err, data, fields) {
        if (err) throw err;
        valid = data;
        doInsert(conn, req, res, valid[0].PRIMARY_ID);
    });
}

function doInsert(con, req, res, id) {
    getBalance(con, req, res, id);
}

function getCheckId(conn, req, res) {

    console.log(req.body.id, req.body.month, req.body.year);
    $sql = "Select PRIMARY_ID from Expenses_Page where PRIMARY_ID='" + req.body.id + "' AND month='" + req.body.month + "' AND year='" + req.body.year + "'";
    conn.query(sql, function(err, data, fields) {});
}

module.exports = router;