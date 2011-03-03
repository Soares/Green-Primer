$(function() {
    layout.load(global.outline);
    layout.load(JSON.parse(global.floor));
    gp.body.trigger('engage.mode', modes.wall);
});
