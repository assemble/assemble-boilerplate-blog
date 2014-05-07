var parseDate = function(context) {
  var date = context.date;
  var re = /some-date-regex/;

  return date.match(re);
};