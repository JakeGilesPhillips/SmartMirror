/** On Document Ready */
$(document).ready(() => {
    updateTime();
});

/** Date Formatting */
var days     = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var months   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Updates the Date and Time every second */
function updateTime() {
    setDate();
    setTime();
    setTimeout(updateTime, 1000);
}

/** Sets the DATE HTML */
function setDate() {
    // Get Date Elements
    var dateObject = new Date();
    var day   = days[dateObject.getDay()];
    var date  = getDate(dateObject.getDate());
    var month = months[dateObject.getMonth()];
    var year  = dateObject.getFullYear();

    // Set Date HTML
    $("#date-time #date #long-date").html(`${day} ${date} ${month} ${year}`);
}

/** Sets the TIME HTML */
function setTime() {
    // Get Time Elements
    var dateObject = new Date();

    // Set Time HTML
    $("#date-time #time #HH-MM").html(dateObject.toLocaleTimeString().substr(0, 5));
    $("#date-time #time #SS").html(dateObject.toLocaleTimeString().substr(6, 2));
}

/** Gets the Date with Prefix */
function getDate(date)
{
    var identifier = parseInt(date.toString().split("")[date.toString().split("").length-1]);
    switch (identifier) 
    {
        case 1: return  `${date}st`;
        case 2: return  `${date}nd`;
        case 3: return  `${date}rd`;
        default: return `${date}th`;
    }
}