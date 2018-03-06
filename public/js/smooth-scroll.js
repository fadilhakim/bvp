$(function() {
    $('.pagelink').click(function() {
      var id = $(this).attr('href');
      $('html,body').animate({ scrollTop: $(id).offset().top-150 }, 'slow');
      return false;
    });
  });