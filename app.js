'use strict'
const express = require('express');
const mysql = require('mysql');
var path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const { Pool } = require('pg');

const app = express();
const indexpath = path.join(__dirname, '/');
const pagesPath = path.join(__dirname, '/Project/package');
const cssPath = path.join(__dirname, '/Project/assest');
const imagpath = path.join(__dirname, '/Project/img');
console.log(__dirname, '/');

app.use("/index", express.static(indexpath));
app.use("/mainpage", express.static(pagesPath));
app.use("/stylesheet", express.static(cssPath));
app.use("/imagepath", express.static(imagpath));
app.use(cookieParser());

app.set('port', process.env.PORT || 2000);
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(app.get('port'));

// const expensepage = require('./Project/package/ExpensesPage/NodejsDb/CREATE_TABLE_IN_DB.js');
// app.use('/expensespage', expensepage);

// const CHEQUE_PAGE = require('./Project/package/ChequePage/Nodejs/Db/ChequeCreateTableDb.js');
// app.use('/CHEQUE_PAGE', CHEQUE_PAGE);

// const EXPENSES_OPENING_AMOUNT_DB = require('./Project/package/ExpensesPage/NodejsDb/OpeningAmountShowDb.js');
// app.use('/openingamount', EXPENSES_OPENING_AMOUNT_DB);

// const EXPENSES_DELETE_DB = require('./Project/package/ExpensesPage/NodejsDb/ExpensesDeleteDb.js');
// app.use('/ExpensesDelete', EXPENSES_DELETE_DB);

// const EXPENSES_UPDATE_DB = require('./Project/package/ExpensesPage/NodejsDb/ExpensesUpdate.js');
// app.use('/ExpensesUpdate', EXPENSES_UPDATE_DB);

// const EXPENSES_EXCEL_TO_DB = require('./Project/package/ExpensesPage/NodejsDb/ImportExceltoDB.js');
// app.use('/ExpensesImportExcelToDB', EXPENSES_EXCEL_TO_DB);


// const DASHBOARD_PAGE = require('./Project/package/DashBoardPage/Nodejs/DashBoardNodejs.js');
// app.use('/DASHBOARD_PAGE', DASHBOARD_PAGE);

// const SALARY_PAGE = require('./Project/package/SalaryPage/Nodejs/CreateDBSalary.js');
// app.use('/SALARY_PAGE', SALARY_PAGE);

// const USER_REGISTARTION = require('./Project/package/AdministrativePanel/DB_User/DBCreateUser.js');
// app.use('/USER_REGISTARTION', USER_REGISTARTION);

// const ADMIN_REGISTARTION = require('./Project/package/AdministrativePanel/DB_Admin/AdminCreateDb.js');
// app.use('/ADMIN_REGISTARTION', ADMIN_REGISTARTION);


var config = {
    user: 'foo',
    database: 'my_db',
    password: 'secret',
    host: 'localhost',
    port: 5432,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000
};
const pool = new Pool(config);
pool.on('error', function(err, client) {
    console.error('idle client error', err.message, err.stack);
});
module.exports = app;