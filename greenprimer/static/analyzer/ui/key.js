$(function() {
  var view = $('#view'), key = $('#key'),
      dash = $('#dashboard'), tools = $('#toolbar');
      show = $('#show'), hide = $('#hide'),
      save = $('#save'), load = $('#load'),
      data = $('#data');
  show.click(function() {
    key.animate({'top': '0'});
    dash.animate({'bottom': '0'});
    tools.animate({'right': '0'}, { complete: function() {
      view.removeClass('fullscreen');
      hide.show();
      show.hide();
    }});
  });
  $(document).keypress(function(e) {
    console.log(e.keyCode);
    if(e.keyCode === 116) {
      if(show.is(':visible')) show.click();
      else if(hide.is(':visible')) hide.click();
    }
  });

  hide.click(function() {
    view.addClass('fullscreen');
    key.animate({'top': '-82px'});
    dash.animate({'bottom': '-150px'});
    tools.animate({'right': '-200px'});
    hide.hide();
    show.show();
  });
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
