var warnings = (function(self) {
    var messages = [];
    var levels = [];
    var counts = [];
    var count = 0;
    var ul, dialog, warnings;

    self.register = function(message, level) {
        var i = messages.length;
        messages.push(message);
        levels.push(level);
        counts.push(0);
        return i;
    };
    self.warn = function(id, repeat) {
        counts[id]++;
        if(counts[id] == 1) warnings.addClass('L'+levels[id]);
        if(!count) warnings.show();
        warnings.html(++count);
        if(repeat && repeat > 0) self.warn(id, repeat-1);
    };
    self.unwarn = function(id) {
        if(!counts[id]) return;
        counts[id]--;
        warnings.html(--count);
        if(!counts[id]) warnings.removeClass('L'+levels[id]);
        if(!count) warnings.hide();
    };
    self.forget = function(id) {
        var c = counts[id];
        for(var i = 0; i < c; i++) self.unwarn(id);
    };

    var show = function() {
        ul.html('');
        for(var i = 0; i < messages.length; i++) {
            if(!counts[i]) continue;
            li = '<li class="L'+levels[i]+'">'+messages[i]+' (' + counts[i] + ')</li>';
            ul.append(li);
        }
        dialog.show();
    };
    var hide = function() {
        dialog.hide();
    };

    $(function() {
        warnings = $('#warnings');
        dialog = $('#errors, #overlay');
        ul = $('#errors .message');
        $('#errors').click(function() { hide(); });
        warnings.click(function() { show(); });
    });

    self.DISJOINT = self.register(
        'There are disjoint interior walls. These may be difficult to wire.', 1);
    self.PLACEMENT = self.register(
        'There are vents placed inconveniently. Consider placing them on better connected walls.', 2);
    self.OVERLAPPING = self.register(
        'You have overlapping walls.', 3);
    self.EXTERIOR = self.register(
        'You have vents placed in the exterior walls. This will break your building envelope.', 3);
    return self;
})(warnings || {});
