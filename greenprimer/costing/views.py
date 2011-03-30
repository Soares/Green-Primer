from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from layouts.models import Layout
from utils import render

@login_required
def statistics(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render(request, 'statistics.hisp', {'layout': layout})
