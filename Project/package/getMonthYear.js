function getMonthNumber(month) {
    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    for (var i = 1; i < months.length + 1; i++) {
        if (months[i] == month) {
            return i + 1;
        }
    }
    return 0;
}

function getYear(month) {
    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    for (var i = 1; i < months.length + 1; i++) {
        if (months[i] == month) {
            return i + 1;
        }
    }
    return 0;
}