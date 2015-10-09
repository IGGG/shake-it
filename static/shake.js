$(function() {
    var THRESHOLD = 12.0,
        old_values = { x: 0, y: 0, z: 0 },
        $my_count = $("#my-count"),
        $all_count = $("#all-count"),
        $interval = $("#interval"),
        count = Number($my_count.text());

    window.addEventListener("devicemotion", function(event) {
        var values = {},
            acceleration = event.acceleration;

        Object.keys(acceleration).forEach(function(key) {
            values[key] = Math.round(acceleration[key] * 10) / 10;
        });

        var isShaken = Object.keys(values).some(function(key) {
            return Math.abs(values[key] - old_values[key]) > THRESHOLD;
        });
        if (isShaken)
            count++;

        // Update the value
        old_values = values;

        $my_count.text(String(count));
        $interval.text(event.interval);
    }, true);

    setInterval(function() {
        $.post(
            '/api/client',
            { 'count': count },
            function(response) {
                count = response.yours;
                $all_count.text(String(response.all));
            }
        );
    }, 3000); // TODO: 負荷の見積もりに応じて適切な値に
});
