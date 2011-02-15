$(function() {
    var formsets = $('.window, .door')
    var rows = $('tr:not(.labels)', formsets);
    var whs = $('.width, .height', rows);
    $('input', whs).before('<div class="slider"></div><br>').change(function() {
        var slider = $(this).siblings('.slider');
        slider.slider('value', parseInt($(this).val()));
    });
    $('.height .slider').slider({
        'min': 0,
        'max': 300,
        'step': 1,
        'slide': function(e, ui) {
            var input = $(this).siblings('input');
            input.val(ui.value + 'cm');
        },
    });
    $('.width .slider').slider({
        'min': 0,
        'max': 500,
        'step': 1,
        'slide': function(e, ui) {
            var input = $(this).siblings('input');
            input.val(ui.value + 'cm');
        },
    });
    $('input', '.width, .height').each(function() {
        $(this).val($(this).val() + 'cm');
    }).change();
    $('.window, .door').find('tr:eq(1) td.label input').each(function() {
        if($(this).val() == '') $(this).val('Standard');
    });
    $('.measure div').buttonset();
    $('td.measure :radio').change(function() {
        if($(this).attr('id').match(/1$/)) console.log('1');
        else console.log('2');
    });
});
