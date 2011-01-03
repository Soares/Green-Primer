$(document).ready(function() {
  $('#hide').click(function() {
    $('#key').addClass('hidden').animate({'top': '-82px'});
  });
  $('#show').click(function() {
    $('#key.hidden').removeClass('hidden').animate({'top': '0'});
    $('#dashboard.hidden').removeClass('hidden').animate({'bottom': '0'});
    $('#toolbar.hidden').removeClass('hidden').animate({'right': '0'}, function() {
      $('#view.fullscreen').removeClass('fullscreen');
    });
  });
  $('#fullscreen').click(function() {
    $('#view').addClass('fullscreen');
    $('#key').addClass('hidden').animate({'top': '-82px'});
    $('#dashboard').addClass('hidden').animate({'bottom': '-150px'});
    $('#toolbar').addClass('hidden').animate({'right': '-200px'});
  });
});
