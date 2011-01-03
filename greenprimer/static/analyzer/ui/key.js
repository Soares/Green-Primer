$(document).ready(function() {
  var view = $('#view'), key = $('#key'),
      dash = $('#dashboard'), tools = $('#toolbar');
      show = $('#show'), hide = $('#hide');
  show.click(function() {
    key.animate({'top': '0'});
    dash.animate({'bottom': '0'});
    tools.animate({'right': '0'}, { complete: function() {
      view.removeClass('fullscreen');
      hide.show();
      show.hide();
    }});
  });
  hide.click(function() {
    view.addClass('fullscreen');
    key.animate({'top': '-82px'});
    dash.animate({'bottom': '-150px'});
    tools.animate({'right': '-200px'});
    hide.hide();
    show.show();
  });
});
