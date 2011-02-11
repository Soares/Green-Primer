var global = {};
global.save_url = '{{ save }}';
{% autoescape off %}
global.data = {% if json %}{{ json }}{% else %}"[]"{% endif %};
{% endautoescape %}
