$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('.pricing-slide').slick({
        dots: true,
        infinite: false,
        arrows: true
    });
});