$(function() {
    var $all_count = $('#all-count'),
        $n_users = $('#n-users');

    setInterval(function() {
        $.get(
            '/api/info',
            function(response) {
                $all_count.text(response.count);
                $n_users.text(String(response.n_users));
            }
        );
    }, 3000); // TODO: 負荷の見積もりに応じて適切な値に
});
