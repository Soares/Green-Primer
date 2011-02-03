var mode = function(self) {
    var engaged = false;

    var events = {
        '#layout': {
            'joint.click': self.jointClick || function() {},
            'wall.click': self.wallClick || function() {},
            'vent.click': self.ventClick || function() {},
            'canvas.click': self.canvasClick || function() {},

            'joint.press': self.jointPress || function() {},
            'wall.press': self.wallPress || function() {},
            'vent.press': self.ventPress || function() {},
            'canvas.press': self.canvasPress || function() {},

            'canvas.mousemove': self.canvasMove || function() {},
            'canvas.depress': self.depress || function() {},
        },
        'body': {
            'esc.keypress': self.escPress || function() {},
            'off.click': self.offClick || function() {},
        },
    };

    var eachEvent = function(callback) {
        $.each(events, function(source, bindings) {
            $.each(bindings, function(name, fn) {
                callback($(source), name, fn);
            });
        });
    };

    $(function() {
        self.button = $(self.button).click(function() {
            gp.body.trigger('disengage.mode');
            gp.body.trigger('engage.mode', self.type);
        });

        gp.body.bind('engage.mode', function(e, type) {
            if(type != self.type) return;
            if(engaged) return;
            self.button.addClass('active');
            eachEvent(function(source, name, fn) { source.bind(name, fn); });
            if(self.engage) self.engage();
            if(self.dot) dot.follower.activate();
            engaged = true;
        });

        gp.body.bind('disengage.mode', function() {
            if(!engaged) return;
            self.button.removeClass('active');
            eachEvent(function(source, name, fn) { source.unbind(name, fn); });
            if(self.disengage) self.disengage();
            if(self.dot) dot.follower.deactivate();
            engaged = false;
        });
    });

    return self;
}
