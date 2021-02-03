date = new Date();
var dateformat = date.toDateString();
var count = 1;
var NODE_NAME = "";

var SELECTMONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
var inputtextid = "";

var divmain = document.createElement("input");

var x_position = 0;
var y_position = 0;
var INPUT_TEXT_WIDTH = 0;
var INPUT_TEXT_HEGITH = 0;

var link = document.createElement('link');
link.rel = "stylesheet";
link.type = "text/css"
link.href = "/asset/css/bootstrap.min.css";
document.head.appendChild(link);

var style = document.createElement('style');
style.innerHTML = `
 .columndiv {
   display: none;
   position: fixed;
   width: 20rem;
   height: 25.5rem;
   margin-left: 1rem;
   background-color: floralwhite;
   border-radius: 20px;
 } `;
document.head.appendChild(style);

function DateInput(inputid) {
    createcalender();
}

function createcalender() {
    divmain.setAttribute("class", "columndiv");
    divmain.setAttribute("type", "date");
    divmain.setAttribute("value", "Hello World!");
    document.body.appendChild(divmain);
    // show(true);
}

function show(boolean) {
    if (boolean == true) {
        divmain.style.display = "block";
    } else {
        divmain.style.display = "none";
    }
}