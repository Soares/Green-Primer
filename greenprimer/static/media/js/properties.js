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
        var row = checkbox.parents('tr');
        var width = row.find('.width'), height = row.find('.height');
        var sliders = row.find('.slider'), faders = $('input, .unit', width.add(height));
        var w = $('input', width), h = $('input', height);
        if(checkbox.is(':checked')) {
            sliders.slider('disable');
            faders.fadeOut('fast');
            w.data('old', w.val()); w.val(0);
            h.data('old', h.val()); h.val(300);
        } else {
            sliders.slider('enable');
            w.val(w.data('old'));
            h.val(h.data('old'));
            faders.fadeIn('fast');
        }
    });
    $('.window .width [value=0]').each(function() {
        $(this).parents('tr').find('.curtain-wall :checkbox').attr('checked', true).change();
    });

    $('#id_zone').attr('disabled', true).after(
        '<input type="hidden" name="zone" value="'+$('#id_zone').val()+'">'
    ).after(
        '<button type="button" id="choose_zone">Choose</button>'
    );
});
