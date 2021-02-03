const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var arr = {};

var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

var month = '';
var year = '';
var requesthttp = '';

router.post('/month-year', function(req, res) {
    month = req.body.month;
    year = req.body.year;
    res.sendStatus(200);

});

router.get('/getTableData', async function(req, res) {
    var SUBTITLE_DATA = await sendDataConvertArray(await getData());
    SUBTITLE_DATA.sort();

    var AMOUNT_DATA = await getAmount(SUBTITLE_DATA);
    console.log(SUBTITLE_DATA);
    var ADD_TWO_DATA = [];
    var hj = { 'Subtitle': SUBTITLE_DATA, 'Amount': AMOUNT_DATA };
    res.json(hj);
});

function sendDataConvertArray(data) {
    var pushdata = new Array();
    var objectlenght = Object.keys(data).length;
    return new Promise(function(resolve, reject) {
        for (let index = 0; index < objectlenght; index++) {
            if (data[index].SUBTITLE != 'Empty' && data[index].SUBTITLE != 'empty') {
                pushdata.push(data[index].SUBTITLE);
                if (objectlenght == parseInt(index + 1)) {
                    resolve(pushdata);
                }
            }
        }
    });
}

function getData() {
    var a = [];
    return new Promise(function(resolve, reject) {
        var sql = "SELECT SUBTITLE FROM Expenses_Page where  MONTH='" + month + "' and YEAR='" + year + "'  GROUP BY SUBTITLE HAVING COUNT(SUBTITLE)>0";
        var d = con.query(sql, function(err, data, fields) {
            resolve(data);
        });
    });
}

async function getAmount(data) {
    var pushdata = new Array();
    var objectlenght = data.length;
    console.log(objectlenght);
    return new Promise(function(resolve, reject) {
        for (let index = 0; index < objectlenght; index++) {
            if (data[index] != 'Empty' && data[index] != 'empty') {
                con.query("SELECT SUM(DEBIT) as DEBIT_AMOUNT FROM Expenses_Page where SUBTITLE ='" + data[index] + "' and  MONTH='" + month + "' and YEAR='" + year + "'", function(error, results, fields) {
                    pushdata.push(results[0].DEBIT_AMOUNT);
                    if (objectlenght == parseInt(index + 1)) {
                        resolve(pushdata);
                        console.log("Index : " + objectlenght, index, pushdata);
                    }
                });
            }
        }
    });
}
module.exports = router;