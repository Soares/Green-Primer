// create on x, y, w, h
// expose width, height
var Rectangle = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.left = x;
    this['top'] = y;
    this.right = x + w;
    this.bottom = y + h;
    this.width = w;
    this.height = h;
    return this;
};
