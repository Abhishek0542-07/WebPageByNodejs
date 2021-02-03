const express = require('express');
const router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

var CREATE_TABLE = "CREATE TABLE USER_SECURITY(PRIMARY_KEY INT(6),Company_Name VARCHAR(225),Email_Id VARCHAR(225),Password VARCHAR(225),Confirm_Password VARCHAR(225),insertdatetime VARCHAR(225))";
checkTableExit(con, 'USER_SECURITY');

let STORE_ALL_TABLE_NAME = [];

function checkTableExit(connection, TableName) {
    connection.query('SHOW tables', function(err, tables) {
        tables.forEach(element => {
            STORE_ALL_TABLE_NAME.push(element.Tables_in_sys)
        });
        if (STORE_ALL_TABLE_NAME.includes(TableName.toLowerCase())) {
            console.log("exit data");
        } else {
            console.log("not exited");
            con.query(CREATE_TABLE, function(err, result) {
                if (err) throw err;
                con.query(" ALTER TABLE USER_SECURITY ADD COLUMN UpdateTimeDate VARCHAR(225)", function(err, data, fields) {});
                console.log("Table created");
            });
        }
    });
}

router.post('/SEND_DATA_LOGIN', async function(req, res) {
    var sql = "Select PRIMARY_KEY from USER_SECURITY ORDER BY PRIMARY_KEY DESC LIMIT 1";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        if (data == '') {
            getId(req, res, con, 0);
        } else {
            getId(req, res, con, data[0].PRIMARY_KEY);
        }

    });
});

function getId(req, res, conn, id) {
    id = id + 1;
    var insert_query = "INSERT INTO USER_SECURITY values('" + id + "','" + req.body.companyname + "','" +
        req.body.email + "','" + req.body.password + "','" + req.body.repeatpassword + "','" +
        req.body.insertdatetime + "','')";
    var sql = "Select Email_Id from USER_SECURITY where Email_Id='" + req.body.email + "'";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        if (data == '') {
            con.query(insert_query, function(err, result) {
                if (err) throw err;
                res.send('SuccessFull Registration');
            });
        } else {
            res.send('Email id already exit.');
        }
    });
}
router.post('/USER_LOGIN_DATA', function(req, res) {
    var sql = "Select Email_Id from USER_SECURITY where Email_Id='" + req.body.email + "' and Password='" + req.body.password + "'";
    con.query(sql, function(err, data, fields) {
        if (err) throw err;
        if (data != '') {
            res.cookie("username", req.body.email, { expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), httpOnly: false });
            res.cookie("password", req.body.password, { expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), httpOnly: false });
            res.send(true);
        } else {
            res.send("Data Not Exit");
        }
    });
});
router.get('/UserlogoutPage', async function(req, res) {
    res.cookie('username', {}, { maxAge: -1 });
    res.cookie('password', {}, { maxAge: -1 });
    res.send(true);
});

module.exports = router;