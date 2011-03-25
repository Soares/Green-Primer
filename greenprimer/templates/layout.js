var global = {};
global.save_url = '{{ save }}';
global.outer = {% if floor %}false{% else %}true{% endif %};
global.inner = !global.outer;

global.windows = {};
var i = 0;
{% for w in layout.windows.all %}
{% if w.label %}
global.windows['{{ w.pk }}'] = {
    label: '{{ w.label }}',
    height: {{ w.height }},
    width: {{ w.width }},
    curtain: {% if w.curtain %}true{% else %}false{% endif %},
    index: i++
};
{% endif %}
{% endfor %}

global.doors = {};
var i = 0;
{% for d in layout.doors.all %}
{% if d.label %}
global.doors['{{ d.pk }}'] = {
    label: '{{ d.label }}',
    width: {{ d.width }},
    index: i++
};
{% endif %}
{% endfor %}

{% autoescape off %}
global.outline = {% if layout.outline %}{{ layout.outline }}{% else %}[]{% endif %};
{% if floor %}
global.floor = {% if floor.json %}{{ floor.json }}{% else %}"[]"{% endif %};
{% endif %}
{% endautoescape %}
