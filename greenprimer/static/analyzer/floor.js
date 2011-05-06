/* The code for the outline editor and floor editor are mostly the same,
 * with minor differences. This is the code that is only loaded on the
 * floor side, and kicks off all of the floor mode stuff.
 * The weirdest part is having to JSON.parse(global.floor) before we
 * load it, while you don't need to JSON.parse(global.outline) in the
 * outline side. Why the discrepancy? Long story short, box2d does some
 * global "magic" that screws with the JSON namespace (angry face), so
 * after loading box2d, deserialization works differently. */
$(function() {
    layout.load(global.outline);
    layout.load(JSON.parse(global.floor));
    gp.body.trigger('engage.mode', modes.wall);
    graph.update();
});
