var global = {};
global.save_url = '{% url layouts.views.save layout.pk %}';
{% autoescape off %}
global.data = {% if layout.json %}{{ layout.json }}{% else %}"[]"{% endif %};
{% endautoescape %}
