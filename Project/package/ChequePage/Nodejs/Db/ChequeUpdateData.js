var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "admin",
    database: "sys"
});

module.exports.UpdateData = function(req, res) {

    var arrayupdate = [req.body.date, req.body.CustomerName, req.body.BankName, req.body.Cheuqe_No,
        req.body.Bank_Transfer_Amount, req.body.amountstatus, req.body.Cheque_Amount, req.body.updatedatetime
    ];
    var DATE_OF_PAYMENT_SELECT = "Select Date_Of_Payment,CustomerName,BankName,Cheuqe_No,Bank_Transfer_Amount,Amount_Status,Cheque_Amount,UpdateTimeDate from Cheque_Page where PRIMARY_ID='" + req.body.id + "' AND month='" + req.body.month + "' AND year='" + req.body.year + "'";

    con.query(DATE_OF_PAYMENT_SELECT, function(err, data, fields) {
        var update = "UPDATE Cheque_Page SET Date_Of_Payment=? , CustomerName=? , BankName=? ,Cheuqe_No=?,Bank_Transfer_Amount=?,Amount_Status=?,Cheque_Amount=?,UpdateTimeDate=? WHERE PRIMARY_ID='" + req.body.id + "' AND month='" + req.body.month + "' AND year='" + req.body.year + "'";
        con.query(update, arrayupdate, function(error, result, rows, fields) {
            res.sendStatus(200);
        });
    });
};