$(function () {
    var marked = function () {
        var converter = new Showdown.converter();
        return function (html) {
            return converter.makeHtml(html);
        };
    } ();

    $('.marked').html(marked($('.marked').html()));
});