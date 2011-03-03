$(document).ready(function() {
  var toolbar = $('#toolbar');
  $('#door-types').change(function() {
    gp.body.trigger('disengage.mode');
    gp.body.trigger('engage.mode', modes.door);
  });
  $('#window-types').change(function() {
    gp.body.trigger('disengage.mode');
    gp.body.trigger('engage.mode', modes['window']);
  });
});
