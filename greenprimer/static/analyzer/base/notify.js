var notify = (function(self) {
    var leftover;

    var get = function(year) {
        var header = $('#s' + year);
        var content = header.next('.content');
        $.get('/costing/materials/' + global.layout_pk + '/' + year + '/', function(data) {
            data = JSON.parse(data);
            content.html(data.html);
            var excess = parseFloat(data.leftover);
            if(excess < 0) header.add(content).addClass('red');

            var diff = excess;
            var sign = diff > 0? '+' : '';
            $('.dollars', header).html('($ ' + sign + diff.toFixed(2) + ')');

            $('#accordion').accordion('resize');
        });
    };

    var materials = function() {
        var header = $('#materials');
        var content = header.next('.content');
        $.get('/costing/materials/' + global.layout_pk + '/', function(data) {
            data = JSON.parse(data);
            content.html(data.html);
            leftover = parseFloat(data.leftover);
            get('2004');
            get('2007');
            get('2009');
        });
    };

    self.go = function() {
        $('#dialog .red').removeClass('red');
        $('#dialog .content').html('Loading...');
        $('#dialog, #overlay').show();

        $.get('/costing/statistics/' + global.layout_pk + '/', function(data) {
          $('#statistics').next('.content').html(data);
          $('#accordion').accordion('resize');
        });
        materials();
    };

    $(function() {
        var dia = $('#dialog, #overlay');
        $('#dialog .x').click(function() { dia.hide(); });
        $('#accordion').accordion({autoHeight: false});
    });

    return self;
})(notify || {});
