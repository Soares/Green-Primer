from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render_to_response
from django.template import RequestContext
from layouts.models import Layout

@login_required
def layout(request, pk):
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
    return render_to_response('layout.hisp', {
        'layout': layout,
    }, RequestContext(request))
