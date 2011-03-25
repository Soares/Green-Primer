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

    var storyheight = $('table.main .story-height input');
    var val = storyheight.val();
    storyheight.before('<div class="slider"></div><br>').after('<div class="output">'+val+' ft</div>').hide();
    $('table.main .story-height .slider').slider({
        'min': 4,
        'max': 12,
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
    $('input', whs).before('<div class="slider"></div><br>').after('<div class="output"></div>').each(function() {
        $(this).siblings('.output').html(imperial($(this).val()));
    }).hide();
    $('.slider', '.width, .height').slider({
        'min': 6,
        'max': 120,
        'slide': function(e, ui) {
            $(this).siblings('input').val(ui.value);
            $(this).siblings('.output').html(imperial(ui.value));
        },
    });
    $('.window .width .slider').slider('option', 'max', 60);
    $('input', whs).each(function() {
        $(this).siblings('.slider').slider('value', $(this).val());
    });

    /* Create the standard default */
    $('.window, .door').find('tr:eq(1) td.label input').each(function() {
        if($(this).val() == '') $(this).val('Standard');
    });

    /* Curtain Wall Toggle */
    $('.labels .curtain label').hide();
    $('.curtain :checkbox').each(function() {
        var checkbox = $(this);
        checkbox.after('<label for="' + checkbox.attr('id') + '">Full Wall</label>');
    }).button().change(function() {
        var checkbox = $(this);
        var row = checkbox.parents('tr');
        var width = row.find('.width'), height = row.find('.height');
        var sliders = row.find('.slider'), faders = $('.output', width.add(height));
        var w = $('input', width), h = $('input', height);
        if(checkbox.is(':checked')) {
            sliders.each(function() {
                max = $(this).slider('option', 'max');
                $(this).slider('value', max);
                $(this).siblings('input').val(max);
                $(this).siblings('.output').html(imperial(max));
            }).slider('disable');
            faders.fadeOut('fast');
        } else {
            sliders.slider('enable');
            faders.fadeIn('fast');
        }
    });
    $('.curtain :checkbox:checked').change();

    $('#id_zone').attr('disabled', true).after(
        '<input type="hidden" name="zone" value="'+$('#id_zone').val()+'">'
    ).after(
        '<button type="button" id="choose_zone">Choose</button>'
    );
});

var imperial = function(val) {
    ft = ~~(val / 12);
    inch = val - (ft * 12);
    return ft + "'" + inch + '"';
};
