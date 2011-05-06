"""
This module provides ajaxy responses to data requests.
These are basically what gets called when the "data" button is pressed.
"""
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.template.loader import render_to_string
from costing.models import Standard
from layouts.models import Layout
from utils import render
import json

@login_required
def statistics(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render(request, 'statistics.hisp', {'layout': layout})

@login_required
def materials(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    data = layout.best_materials()
    return HttpResponse(json.dumps({
        'html': render_to_string('materials.hisp', data),
        'leftover': '%.2f' % data['leftover'],
    }), mimetype='text/plain')

@login_required
def standard(request, layout, year):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    standard = get_object_or_404(Standard, year=year)
    data = layout.materials_for(standard)
    return HttpResponse(json.dumps({
        'html': render_to_string('materials.hisp', data),
        'leftover': '%.2f' % data['leftover'],
    }), mimetype='text/plain')
