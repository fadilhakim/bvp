
$(document).ready(function () {
    function init() {
        if (localStorage["name"]) {
            $('#businessName').val(localStorage["name"]);
        }
        if (localStorage["email"]) {
            $('#email').val(localStorage["email"]);
        }
        if (localStorage["password"]) {
            $('#password').val(localStorage["password"]);
        }
    }
    init();
});

$('.stored').keyup(function () {
    localStorage[$(this).attr('name')] = $(this).val();
});

