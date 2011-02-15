from django.shortcuts import render_to_response
from django.template import RequestContext
from django.forms import widgets
from django.utils.safestring import mark_safe
from django.utils.encoding import force_unicode
from django.utils.html import conditional_escape


def render(request, template, context=None):
    return render_to_response(template, context, RequestContext(request))


""" Alternate Radio Rendering (compliant with jqueryui.buttonset) """
class RadioFieldRenderer(widgets.RadioFieldRenderer):
    def render(self):
        return mark_safe(u'<div>\n%s\n</div>' % u'\n'.join(force_unicode(w) for w in self))

    def __iter__(self):
        for i, choice in enumerate(self.choices):
            yield RadioInput(self.name, self.value, self.attrs.copy(), choice, i)


class RadioSelect(widgets.RadioSelect):
    renderer = RadioFieldRenderer


class RadioInput(widgets.RadioInput):
    def __unicode__(self):
        if 'id' in self.attrs:
            label_for = ' for="%s_%s"' % (self.attrs['id'], self.index)
        else:
            label_for = ''
        choice_label = conditional_escape(force_unicode(self.choice_label))
        return mark_safe(u'%s<label%s>%s</label>' % (self.tag(), label_for, choice_label))
