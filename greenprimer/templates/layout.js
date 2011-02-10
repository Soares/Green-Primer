var global = {};
global.save_url = '{% url layouts.views.save layout.pk %}';
{% autoescape off %}
global.data = {{ layout.json }};
{% endautoescape %}
