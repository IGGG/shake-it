$(function() {
    var svg = d3.select("g.equalizer")
        .attr("transform", "translate(100, 100)");

    var leds = [];
    var eq = svg.selectAll(".ledarray").data(d3.range(0, 1000, 50)); // 第2引数 ピクセル 横幅
    eq.enter().append("g")
        .attr("class", "ledarray")
        .each(function(d, i) {
            var led = iopctrl.ledarray();
            led.scale().domain([0, 1]).range([500, 0]); // 第1引数 ピクセル 縦幅
            d3.select(this).attr("transform", "translate("+d+")")
                .call(led);
            led.value(0);
            leds.push(led);
        });

    var refresh = (function () {
        var last_sum = Number($("#initial-value").text()),
            sums_of_interval = [];

        for (var i = 0; i < leds.length; i++)
            sums_of_interval.push(0);

        return function() {
            $.get(
                '/api/info',
                function(response) {
                    sums_of_interval.shift();
                    var sum = response.count;
                    sums_of_interval.push(sum - last_sum);
                    last_sum = sum;
                }
            );

            var max = Math.max.apply(null, sums_of_interval);
            if (max == 0)
                max = 1;
            var normalized = sums_of_interval.map(function(x) { return x / max });

            for (var i = 0; i < normalized.length; i++)
                leds[i].value(normalized[i]);
        };
    })();

    setInterval(refresh, 500);
});
