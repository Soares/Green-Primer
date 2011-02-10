$(function() {
    layout.load(JSON.parse(global.data));
    gp.body.trigger('engage.mode', modes.wall);
});
