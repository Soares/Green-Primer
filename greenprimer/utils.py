from django.shortcuts import render_to_response
from django.template import RequestContext

def render(request, template, context=None):
    return render_to_response(template, context, RequestContext(request))
