modes.ventilate = (function(self) {
    var canvas, context, interval;

    self.type = modes.VENTILATE;
    self.button = '#internal-flow';
    self.dot = false;

    var update = function() {
        layout.vents.step();
        layout.vents.draw(context);
    };

    self.engage = function() {
        interval = setInterval(update, 200);
    };

    self.disengage = function() {
        if(interval); clearInterval(interval);
        layout.vents.reset();
        context.clearRect(0, 0, gp.WIDTH, gp.HEIGHT);
    };

    $(function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        // Consider 'source-over', 'lighter', 'darker', and 'xor'
        context.globalCompositeOperation = 'source-over';
    });

    return mode(self);
})({});
