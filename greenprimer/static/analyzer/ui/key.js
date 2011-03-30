$(document).ready(function() {
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
  data.click(function() {
    $('#dialog, #overlay').show();
    $('#accordion').accordion('resize');
  });
  $('#exit').click(function() {
    window.location.replace('/home/');
  });

  var push = function(contents, success) {
    $.post(global.save_url, {
      'data': JSON.stringify(contents.data),
      'windows': JSON.stringify(contents.windows),
      'doors': JSON.stringify(contents.doors),
      'perimiter': JSON.stringify(contents.perimiter),
    }, success, 'json');
  };
});
