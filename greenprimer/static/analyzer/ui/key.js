/* The key is the round thing in the top center. This module sets up
 * all of the key buttons. */
$(function() {
  var view = $('#view'), key = $('#key'),
      dash = $('#dashboard'), tools = $('#toolbar');
      show = $('#show'), hide = $('#hide'),
      save = $('#save'), load = $('#load'),
      data = $('#data');
  var showClick = function() {
    key.animate({'top': '0'});
    dash.animate({'bottom': '0'});
    tools.animate({'right': '0'}, { complete: function() {
      view.removeClass('fullscreen');
      hide.show();
      show.hide();
    }});
  };
  show.click(showClick);

  $(document).keypress(function(e) {
    if(e.keyCode === 116) {
      if(show.is(':visible')) showClick();
      else if(hide.is(':visible')) hideClick();
    }
  });

  var hideClick = function() {
    view.addClass('fullscreen');
    key.animate({'top': '-82px'});
    dash.animate({'bottom': '-150px'});
    tools.animate({'right': '-200px'});
    hide.hide();
    show.show();
  };
  hide.click(hideClick);

  save.click(function() {
    push(layout.save());
  });
  load.click(function() {
    push(layout.save(), function() {
      window.location.replace('/home/');
    });
  });
  data.click(function() { notify.go(); });
  $('#exit').click(function() {
    window.location.replace('/home/');
  });

  var push = function(contents, success) {
    $.post(global.save_url, gp.prepare(contents), success, 'json');
  };
});
