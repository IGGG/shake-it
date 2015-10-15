$(function() {
    if (!('ondevicemotion' in window))
        return;

    var THRESHOLD = 12.0,
        AXES = ['x', 'y', 'z'],
        old_values = { x: 0, y: 0, z: 0 },
        $initial_count = $("#initial-count"),
        count = Number($initial_count.text());

    window.addEventListener("devicemotion", function(event) {
        var values = {},
            acceleration = event.accelerationIncludingGravity;

        AXES.forEach(function(key) {
            values[key] = Math.round(acceleration[key] * 10) / 10;
        });

        var isShaken = Object.keys(values).some(function(key) {
            return Math.abs(values[key] - old_values[key]) > THRESHOLD;
        });
        if (isShaken)
            count++;

        // Update the value
        old_values = values;
    }, true);

    setInterval(function() {
        $.post(
            '/api/client',
            { 'count': count },
            function(response) { count = response.count; }
        );
    }, 500);
});
