$(document).ready(function() {

  /* Joystick */
  $('#view').scrollTo('50%');
  $('#joystick').draggable({
    'revert': true,
    'maxdist': scroll.MAX_DIST,
    'drag': scroll.drag,
  }).click(function() {
    $('#view').scrollTo('50%');
  });
  $(document).mouseup(function() {
    scroll.stop();
  });
  $('#layers a').click(function(e) {
    var href = $(this).attr('href');
    var contents = layout.save();
    $.post(global.save_url, gp.prepare(contents), function() {
      window.location.replace(href);
    }, 'json');
    e.preventDefault();
    return false;
  });
});
