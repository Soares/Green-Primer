$(function() {
    $('#z5').show();
    $('#zone_slider').slider({
        min: 1,
        max: 7,
        value: 5,
        slide: slide,
        change: slide,
    });

    $('#choose_zone').click(function() {
        $('#zone_slider').slider('value', $('#id_zone').val());
        $('#zoning').show();
    });
    $('#select_zone').click(function() {
        $('[name=zone]').val($('#zone_slider').slider('value'));
        $('#zoning').hide();
    });
});

var slide = function(e, ui) {
    $('.zoneimg').hide();
    $('#z'+ui.value).show();
};
