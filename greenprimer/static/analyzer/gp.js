var gp = (function(self) {
    self.GRID = 20;

    $(function() {
        self.view = $('#view');
        self.layout = $('#layout');
        self.canvas = $('#canvas');

        self.WIDTH = self.layout.outerWidth();
        self.HEIGHT = self.layout.outerHeight();

        self.svg = Raphael(document.getElementById('layout'), gp.WIDTH, gp.HEIGHT);
        self.svg.canvas.id = 'svg';

        self.body = $('body');
    });

    return self;
})(gp || {});
