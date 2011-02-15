$(function() {
    var stories = $('table.main .stories input');
    var val = stories.val();
    stories.before('<div class="slider"></div><br>').after('<div class="output">'+val+'</div>').hide();
    $('table.main .stories .slider').slider({
        'min': 1,
        'max': 7,
        'slide': function(e, ui) {
            $(this).siblings('input').val(ui.value);
            $(this).siblings('.output').html(ui.value);
        },
        'value': val,
    });

    /* Width/Height Slider Creation */
    var formsets = $('.window, .door')
    var rows = $('tr:not(.labels)', formsets);
    var whs = $('.width, .height', rows);
    $('input', whs).before('<div class="slider"></div><br>').change(function() {
        var slider = $(this).siblings('.slider');
        slider.slider('value', parseInt($(this).val()));
    });
    $('.slider', '.width, .height').slider({
        'min': 10,
        'max': 300,
        'step': 10,
        'slide': function(e, ui) { $(this).siblings('input').val(ui.value); },
    });
    $('.width .slider').slider('option', 'max', 500);

    /* Width/Height Slider Initialization */
    $('input', '.width, .height').after('<span class="unit">cm</span>').change();

    /* Create the standard default */
    $('.window, .door').find('tr:eq(1) td.label input').each(function() {
        if($(this).val() == '') $(this).val('Standard');
    });

    /* Curtain Wall Toggle */
    $('.labels .curtain-wall label').hide();
    $('.curtain-wall :checkbox').each(function() {
        var checkbox = $(this);
        checkbox.after('<label for="' + checkbox.attr('id') + '">Full Wall</label>');
    }).button().change(function() {
        var checkbox = $(this);
        var width = checkbox.parents('tr').find('.width');
        var slider = width.find('.slider'),
            faders = $('input, .unit', width),
            input = $('input', width);
        if(checkbox.is(':checked')) {
            slider.slider('disable');
            faders.fadeOut('fast');
            input.data('old', input.val());
            input.val(0);
        } else {
            slider.slider('enable');
            input.val(input.data('old'));
            faders.fadeIn('fast');
        }
    });
});
