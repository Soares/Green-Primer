var notify = (function(self) {
    self.box = null;

    self.warn = function() {};
    self.unwarn = function() {};

    self.on = function() {
        $('#overlay, #dialog').show();
        return self;
    };
    self.off = function() {
        $('#overlay, #dialog').hide();
        return self;
    };
    self.good = function() {
        $('#dialog').removeClass('bad');
        return self;
    };
    self.bad = function() {
        $('#dialog').addClass('bad');
        return self;
    };

    $(function() {
        var dia = $('#dialog, #overlay');
        $('#dialog .x').click(function() { dia.hide(); });
        $('#accordion').accordion();
    });

    return self;
})(notify || {});
