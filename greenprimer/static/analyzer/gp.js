var gp = (function(self) {
    self.GRID = 20;

    $(function() {
        self.view = $('#view');
        self.layout = $('#layout');
        self.canvas = $('#canvas');
        self.context = document.getElementById('canvas').getContext('2d');

        self.WIDTH = self.layout.outerWidth();
        self.HEIGHT = self.layout.outerHeight();

        self.canvas.data('width', self.WIDTH);
        self.canvas.data('height', self.HEIGHT);
        self.canvas.data('top', self.canvas.css('top'));
        self.canvas.data('left', self.canvas.css('left'));


        self.svg = Raphael(document.getElementById('layout'), gp.WIDTH, gp.HEIGHT);
        self.svg.canvas.id = 'svg';

        self.body = $('body');
    });

    return self;
})(gp || {});
