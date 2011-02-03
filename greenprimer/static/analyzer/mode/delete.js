modes['delete'] = (function(self) {
    self.type = modes.SELECT;

    self.button = '#delete';

    self.engage = function() {};
    self.disengage = function() {};

    self.jointClick = function() {};
    self.wallClick = function() {};
    self.canvasClick = function() {};
    self.escPress = function() {};
    self.offClick = function() {};

    return mode(self);
})({});

