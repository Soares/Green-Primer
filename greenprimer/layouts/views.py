from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from layouts.models import Layout, Floor
from layouts.forms import LayoutForm, WindowFormSet, DoorFormSet
from django.shortcuts import redirect
from django.http import Http404, HttpResponse
from django.core.urlresolvers import reverse
from utils import render

@login_required
def new(request):
    if request.method == 'POST':
        form = LayoutForm(request.POST)
        windows = WindowFormSet(request.POST, prefix='windows')
        doors = DoorFormSet(request.POST, prefix='doors')
        if form.is_valid() and windows.is_valid() and doors.is_valid():
            layout = form.create(request)
            windows.create(layout)
            doors.create(layout)
            return redirect(layout)
    else:
        form = LayoutForm()
        windows = WindowFormSet(prefix='windows')
        doors = DoorFormSet(prefix='doors')
    return render(request, 'properties.hisp', {
        'form': form,
        'windows': windows,
        'doors': doors,
    })
       

@login_required
def properties(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.method == 'POST':
        form = LayoutForm(request.POST, instance=layout)
        windows = WindowFormSet(request.POST, prefix='windows')
        doors = DoorFormSet(request.POST, prefix='doors')
        if form.is_valid() and windows.is_valid() and doors.is_valid():
            form.save()
            windows.save()
            doors.save()
            return redirect('users.views.home')
    else:
        form = LayoutForm(instance=layout)
        windows = WindowFormSet(prefix='windows')
        doors = DoorFormSet(prefix='doors')
    return render(request, 'properties.hisp', {
        'layout': layout,
        'form': form,
        'windows': windows,
        'doors': doors,
    })

@login_required
def duplicate(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.method == 'POST':
        form = LayoutForm(request.POST, instance=layout)
        if form.is_valid():
            new = form.save(commit=False)
            new.id = None
            new.save()
            return redirect(new)
    else:
        form = LayoutForm(instance=layout, initial={'name': layout.name + ' (copy)'})
    return render(request, 'duplicate.hisp', {'form': form})

@login_required
def delete(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.POST.get('delete'):
        layout.delete()
    if request.method == 'POST':
        return redirect('users.views.home')
    return render(request, 'delete.hisp', {'layout': layout})

@login_required
def outline(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render(request, 'outline.hisp', {'layout': layout})

@login_required
def floor(request, layout, story):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    floor = get_object_or_404(Floor, layout=layout, story=story)
    return render(request, 'layout.hisp', {'layout': layout, 'floor': floor})

@login_required
def outersave(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.method != 'POST':
        raise Http404
    data = request.POST.get('data', '')
    layout.outline = data;
    layout.save()
    return HttpResponse('true')

@login_required
def innersave(request, layout, story):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    floor = get_object_or_404(Floor, layout=layout, story=story)
    if request.method != 'POST':
        raise Http404
    data = request.POST.get('data', '')
    floor.json = data;
    floor.save()
    return HttpResponse('true')

@login_required
def outerjs(request, layout):
    from django.shortcuts import render_to_response
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render_to_response('layout.js', {
        'json': layout.outline,
        'save': reverse('layouts.views.outersave', args=[layout.pk]),
    }, mimetype='text/javascript')

@login_required
def innerjs(request, layout, story):
    from django.shortcuts import render_to_response
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    floor = get_object_or_404(Floor, layout=layout, story=story)
    return render_to_response('layout.js', {
        'json': floor.json,
        'save': reverse('layouts.views.innersave', args=[layout.pk, floor.story]),
    }, mimetype='text/javascript')
