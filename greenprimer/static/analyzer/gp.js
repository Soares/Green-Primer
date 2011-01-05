var gp = (function(self) {
    self.GRID = 20;

    $(document).ready(function() {
        self.layout = $('#layout');
        self.svg = $('#svg');
        self.canvas = $('#canvas');

        self.WIDTH = layout.outerWidth();
        self.HEIGHT = layout.outerHeight();

        self.paper = Raphael(document.getElementById('svg'), gp.WIDTH, gp.HEIGHT);
        self.paper.canvas.id = 'interface';
    });

    return self;
})(gp || {});
