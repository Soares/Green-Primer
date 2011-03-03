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
});
