function EmailValidation(val) {
    var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
    if (val.match(mailformat)) {
        alert("Valid email address!");
        return true;
    } else {
        alert("You have entered an invalid email address!");
        return false;
    }
}

function MobileNumberValidation(number) {
    if (number.length == 10) {
        alert("Number valid");
    } else {
        alert("Number not valid");
    }
}