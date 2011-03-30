from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from costing.models import Standard
from layouts.models import Layout
from utils import render

@login_required
def statistics(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render(request, 'statistics.hisp', {'layout': layout})

@login_required
def materials(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render(request, 'materials.hisp', {
        'layout': layout,
        'wall': layout.wall,
        'roof': layout.roof,
        'windows': layout.windows,
        'cost': layout.price,
    })

@login_required
def standard(request, layout, year):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    standard = get_object_or_404(Standard, year=year)
    return render(request, 'standard.hisp', {
        'layout': layout,
        'standard': standard,
        'wall': layout.wall_insulation(standard),
        'roof': layout.roof_insulation(standard),
        'window': layout.windows_for(standard),
        'cost': layout.cost_for(standard),
    })

@login_required
def leftover(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return HttpResponse(layout.price - layout.budget, mimetype='text/javascript')

@login_required
def diff(request, layout, year):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    standard = get_object_or_404(Standard, year=year)
    return HttpResponse(layout.budget - layout.cost(standard), mimetype='text/javascript')
