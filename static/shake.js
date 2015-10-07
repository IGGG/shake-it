$(function() {
    var xValue = 0,
        yValue = 0,
        zValue = 0,
        $my_count = $("#my-count"),
        $all_count = $("#all-count"),
        $interval = $("#interval"),
        count = Number($my_count.text());

    window.addEventListener("devicemotion", function (event) {
        var x = Math.round(event.acceleration.x * 10) / 10;
        var y = Math.round(event.acceleration.y * 10) / 10;
        var z = Math.round(event.acceleration.z * 10) / 10;

        if ((Math.abs(xValue - x) > 2.5) || (Math.abs(yValue - y) > 2.5) || (Math.abs(zValue - z) > 2.5)) {
            count++;
        }

        // Update the value
        xValue = x;
        yValue = y;
        zValue = z;

        $my_count.text(String(count));
        $interval.text(event.interval);
    }, true);

    setInterval(function() {
        $.post(
        '/api',
        {'count': count},
        function(response) {
            count = response.yours;
            $all_count.text(String(response.all));
        })
    }, 3000); // TODO: 負荷の見積もりに応じて適切な値に
});
