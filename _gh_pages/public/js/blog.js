/********************************************
Update

Following code inspired from the moment.js
documentation
********************************************/

function update(){

    $('#js-format').html(formatHtml());
    $('#js-from-now').html(fromHtml());
    $('#js-calendar').html(calendarHtml());
    $('#js-lang').html(langHtml());

    var now = moment(),
        second = now.seconds() * 6,
        minute = now.minutes() * 6 + second / 60,
        hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;


    $('#hour').css("transform", "rotate(" + hour + "deg)");
    $('#minute').css("transform", "rotate(" + minute + "deg)");
    $('#second').css("transform", "rotate(" + second + "deg)");
}

function timedUpdate () {
    update();
    setTimeout(timedUpdate, 1000);
}

timedUpdate();
