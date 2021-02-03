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

 var divmain = document.createElement("div");
 var HEADER_WEEKDAYS = document.createElement("div");
 var NEXT_AND_BACK_HEADER = document.createElement("div");
 var HEADER_WEEKS = document.createElement("div");
 var HEADER_DAYS = document.createElement('div');

 var x_position = 0;
 var y_position = 0;
 var INPUT_TEXT_WIDTH = 0;
 var INPUT_TEXT_HEGITH = 0;

 var link = document.createElement('link');
 link.rel = "stylesheet";
 link.type = "text/css"
 link.href = "/mainpage/asset/css/bootstrap.min.css";
 document.head.appendChild(link);

 var style = document.createElement('style');
 style.innerHTML = `
  .columndiv {
    display: none;
    position: fixed;
    width: 15rem;
    height: 18.5rem;
    margin-left:1rem;
    margin-top:1rem;
    background-color:transparent;
    border-radius: 20px;
    z-index:1;
  }
 .columndiv .card
  {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    background-color: #f8f8f800;
    justify-content: center;
    outline: none;
    border: none;
    flex-direction: row;
    align-items: center;
  }
   .columndiv .card-1
  {
    width: 100% !important;
    height: 11% !important;
    display: flex;
    background-color: floralwhite;
    margin-top: -.4rem;
    justify-content: center;
    border-bottom: 2px solid black;
    outline: none;
    flex-direction: row;
    align-items: center;
    color: black;
  } 
   .columndiv .card-1 div {
    font-size: 1.5rem;
    font-weight: bold;
    width: calc(99% / 7);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: cursive;
    text-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.5);
    color: black;
  }
  .columndiv .card-2
  {
    width: 100%;
    height: 69% !important;
    display: flex;
    /* margin-left: 0.2rem; */
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    border-bottom-left-radius: 9px;
    border-bottom-right-radius: 9px;
    background-color: floralwhite;
  }
   .columndiv .card-2 div {
    font-size: 1.5rem;
    width: calc(99% / 7);
    height: calc(99% /6);
    display: flex;
    font-weight: bold;
    font-family: cursive;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0.3rem 0.5rem rgba(0,0,0,.5);
    transition: background-color 0.2s;
    border-radius: 4rem;
    color: #070606;
  }
  .columndiv .row
 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: -1px;
  height: 10vh;
  margin-left: 0rem;
  background-color: #607D8B;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
 }
 .columndiv .fas
 {
    color: white;
    position: static;
    width:3vw;
    padding: 11px;
    font-size:1.9rem;
    font-weight: bold;
    float: left !important;
    cursor: pointer;
 }
  .columndiv .days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem;
}
 .columndiv .card-2 div:hover:not(.today) {
  background-color: #16697a;
  border: 0.2rem solid #777;
  color:white;
  cursor: pointer;
}
 .columndiv .prev-date,
.next-date {
  opacity: 0.5;
}
 .columndiv .today {
    background-color: #000000;
    cursor: pointer;
    color: white !important;
    outline-color: #1ababa;
    border: 3px solid #74f3e4;
}
 .columndiv #MonthNameid
{
    width:100%;
    display: flex;
    padding: 7%;
    font-size:1.4rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: white;
}
 .columndiv .fas:hover
  {
    color:yellow;
    font-size:2.5rem;
  }
  .icondiv
  {
      width:20%;
      height:20%;
      color:black;
      font-size:2rem;
  }
 #calenderid
  {
    z-index: 1;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-left: -11%;
    margin-top: 4%;
  }
  `;
 document.head.appendChild(style);
 var i = 0;
 var INPUT_ID = '';
 var DIV_CLASS_NAME = '';
 var CALENDER_ID = '';

 function addCalenderIcon(sendinputid) {
     //calender-icon create
     var INPUT_ID1 = sendinputid.replace("#", "");
     DIV_CLASS_NAME = "new" + INPUT_ID1;
     $(sendinputid).wrap("<div class='" + DIV_CLASS_NAME + "' style='display:flex;'></div>");
     $("." + DIV_CLASS_NAME).removeClass(" fa-calendar-alt");
     $("." + DIV_CLASS_NAME).attr("autocomplete", "off");
     $("." + DIV_CLASS_NAME).append('<i class="far fa-calendar-alt" id=' + DIV_CLASS_NAME + "calenderid" + ' style=" z-index: 1;color: white; font-size: 20px;cursor: pointer;     margin-left: -11%;margin-top: 4%;"></i>');

     CALENDER_ID = DIV_CLASS_NAME + "calenderid";
     $(sendinputid).attr("autocomplete", "off");
     inputheightwidth(sendinputid);
     $("#" + CALENDER_ID).click(function(e) {
         showpopCalender(sendinputid);
     });
 }

 function showpopCalender(inputid) {

     if (inputid != '') {

         inputtextid = inputid;
         $(inputtextid).val(dateformat);

         NODE_NAME = $(inputid).parent();
         createcalender();
         inputheightwidth(inputid);
         show(true);
         var parentEls = $(inputtextid).parents()
             .map(function() {
                 return this.tagName;
             }).get().join(", ");

         $('.card,i').click(function(e) {
             e.stopPropagation();
         });
         $(document).mouseup(function(e) {
             var container = $(".columndiv");
             if (container.has(e.target).length === 0) {
                 container.hide();
             }
         });
     }
 }

 function inputheightwidth(inputid) {

     INPUT_ID = inputid.replace("#", "");
     INPUT_TEXT_WIDTH = $(inputid).width();
     INPUT_TEXT_HEGITH = $(inputid).height();

     y_position = document.getElementById(INPUT_ID).offsetTop;
     x_position = document.getElementById(INPUT_ID).offsetLeft;

     var p = document.getElementById(INPUT_ID);

     var MARGIN_LEFT = (p.offsetWidth / 16);

     var MARGIN_TOP = (p.offsetHeight / 2) + INPUT_TEXT_HEGITH;
     divmain.style.marginTop = MARGIN_TOP + "px";
     divmain.style.marginLeft = Math.round(MARGIN_LEFT) - 5 + "px";
     divmain.style.width = (INPUT_TEXT_WIDTH) + "px";

     if (CALENDER_ID != '') {
         var CANLENDER_CHANGE_CSS_PROPERTIES = document.getElementById(CALENDER_ID);
         CANLENDER_CHANGE_CSS_PROPERTIES.style.marginTop = Math.round(p.offsetHeight - INPUT_TEXT_HEGITH) - 1 + "px";
         CANLENDER_CHANGE_CSS_PROPERTIES.style.marginLeft = "-28px";
     }
 }

 function createcalender() {
     divmain.setAttribute("class", "columndiv");
     $(NODE_NAME).append(divmain);
     CalenderCreate();
 }

 function show(boolean) {
     if (boolean == true) {
         divmain.style.display = "block";
     } else {
         $('.columndiv').hide();
     }
 }

 function HEADER_NEXT_BACK_CRAETE() {
     HEADER_WEEKDAYS.setAttribute("class", "row");
 }

 function nextandbackHeader() {
     NEXT_AND_BACK_HEADER.setAttribute("class", "card");
     HEADER_WEEKDAYS.appendChild(NEXT_AND_BACK_HEADER);
 }

 function CalenderCreate() {
     HEADER_NEXT_BACK_CRAETE();
     var dayarray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
     var FULL_NAME_DAY_ARRAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

     NEXT_AND_BACK_HEADER.innerHTML = "<i class='fas fa-arrow-left prev'></i><h5 id='MonthNameid'></h5><i class='fas fa-arrow-right next' style='float:right' ></i>";
     let create = "";
     for (var i = 0; i < dayarray.length; i++) {
         create += `<div title=${ FULL_NAME_DAY_ARRAY[i]}>${dayarray[i]}</div>`;
         HEADER_WEEKS.innerHTML = create;
     }
     divmain.appendChild(HEADER_WEEKDAYS);
     nextandbackHeader();

     HEADER_WEEKS.setAttribute("class", "card-1");
     divmain.appendChild(HEADER_WEEKS);


     var d = date.getMonth();
     renderCalendar(d);

     document.querySelector(".prev").addEventListener("click", (e) => {
         var d = date.getMonth() - count;
         renderCalendar(d);
         e.stopPropagation();
     });

     document.querySelector(".next").addEventListener("click", (e) => {
         var d = date.getMonth() + count;
         renderCalendar(d);
         e.stopPropagation();
     });
 }

 function renderCalendar(val) {
     date.setMonth(val);
     date.setDate(1);
     HEADER_DAYS.setAttribute("class", "card-2");

     var lastDay = new Date(
         date.getFullYear(),
         date.getMonth() + 1,
         0).getDate();

     var prevLastDay = new Date(
         date.getFullYear(),
         date.getMonth(),
         0).getDate();

     var firstDayIndex = date.getDay();

     var lastDayIndex = new Date(
         date.getFullYear(),
         date.getMonth() + 1,
         0).getDay();

     var nextDays = 7 - lastDayIndex - 1;
     let days = "";

     for (let x = firstDayIndex; x > 0; x--) {
         days += `<div title=${prevLastDay - x + 1+"/"+date.getMonth()+"/"+date.getFullYear()} class="prev-date">${prevLastDay - x + 1}</div>`;
     }
     for (let i = 1; i <= lastDay; i++) {
         if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
             days += `<div title=${i+"/"+(date.getMonth()+1)+"/"+date.getFullYear()} class="today">${i}</div>`;
         } else {
             if (i < 10) {
                 days += `<div title=${"0"+i+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}>${i}</div>`;
             } else {
                 days += `<div title=${i+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}>${i}</div>`;
             }
         }
     }
     for (let j = 1; j <= nextDays; j++) {
         days += `<div class="next-date">${j}</div>`;
         HEADER_DAYS.innerHTML = days;
     }
     divmain.appendChild(HEADER_DAYS);
     var DATECHECKPATTREN = "";

     var inner = document.querySelectorAll('.card-2');
     document.querySelector("#MonthNameid").innerHTML = SELECTMONTHS[date.getMonth()] + "<br>" + date.toDateString();

     var newmonth = new Date();
     newmonth.setMonth(date.getMonth() + 1);
     var newyear = new Date();
     if ((date.getMonth() + 1) == 12) {
         newyear.setFullYear(date.getFullYear() + 1);
     } else {
         newyear.setFullYear(date.getFullYear());
     }

     document.querySelector('.card-2').addEventListener('click', (e) => {

         if (e.path[0].classList == "prev-date") {
             if (isDate(getDateformatString(e.path[0].innerHTML, date.getMonth(), date.getFullYear()))) {
                 $(inputtextid).val(getDateformatString(e.path[0].innerHTML, date.getMonth(), date.getFullYear()));
                 show(false);
             }
         } else if (e.path[0].classList == "next-date") {
             if (isDate(getDateformatString(e.path[0].innerHTML, newmonth.getMonth() + 1, newyear.getFullYear()))) {
                 $(inputtextid).val(getDateformatString(e.path[0].innerHTML, newmonth.getMonth() + 1, newyear.getFullYear()));
                 show(false);
             }
         } else {
             if (isDate(getDateformatString(e.path[0].innerHTML, date.getMonth() + 1, date.getFullYear()))) {
                 $(inputtextid).val(getDateformatString(e.path[0].innerHTML, date.getMonth() + 1, date.getFullYear()));
                 show(false);
             }
         }
     });

 }

 function isDate(str) {
     var parms = str.split(/[\.\-\/]/);
     var yyyy = parseInt(parms[2], 10);
     var mm = parseInt(parms[1], 10);
     var dd = parseInt(parms[0], 10);
     var date = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
     return mm === (date.getMonth() + 1) && dd === date.getDate() && yyyy === date.getFullYear();
 }

 function getDateformatString(selectval, month, year) {
     var formatdate = "";
     if (month < 10) {
         month = "0" + month;
     }
     if (month > 12) {
         if (selectval > 10) {
             formatdate = selectval + "/" + month + "/" + year;
         } else {
             formatdate = "0" + selectval + "/" + month + "/" + year;
         }
     } else if (month != 0) {
         if (selectval > 10) {
             formatdate = selectval + "/" + month + "/" + year;
         } else {
             formatdate = "0" + selectval + "/" + month + "/" + year;
         }
     } else {
         if (selectval > 10) {
             formatdate = selectval + "/" + (12) + "/" + (year - 1);
         } else {
             formatdate = "0" + selectval + "/" + "0" + (month + 1) + "/" + (year);
         }
     }
     return formatdate;
 }