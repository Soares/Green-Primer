modes.ventilate = (function(self) {
    var canvas, context, interval;

    $(function() {
        $(document).keypress(function(e) {
            if(e.keyCode != 118) return;
            $('#internal-flow').click();
        });
    });

    self.button = '#internal-flow';
    self.dot = false;

    var update = function() {
        layout.vents.step();
        layout.vents.draw(context);
    };

    self.engage = function() {
        physics.reset();
        for(var i = 0; i < walls.all.length; i++) {
            walls.all[i].simulate();
        }
        for(var i = 0; i < vents.all.length; i++) {
            vents.all[i].simulate();
        }
        physics.start();
    };

    self.disengage = function() {
        physics.stop();
    };

    return mode(self);
})({});
