$(document).ready(function() {
  var toolbar = $('#toolbar');
  var buttons = $('#toolbar table.buttons');
  $('tr.button td', buttons).click(function() {
    if($(this).is('.active')) return;
    $('td.active', buttons).removeClass('active');
    $('.options:visible', buttons).slideUp();
    $(this).addClass('active');
    $(this).parents('tr').next('tr.box').find('.options').slideDown();
  });
  $('tr.button:first-child td', buttons).click();
  $('.buttonset', buttons).buttonset();
});
