from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from layouts.models import Layout, Floor, Window, Door
from layouts.forms import LayoutForm, WindowFormSet, DoorFormSet
from django.shortcuts import redirect
from django.db.transaction import commit_on_success
from django.http import Http404, HttpResponse
from django.core.urlresolvers import reverse
from utils import render

@commit_on_success
@login_required
def new(request):
    if request.method == 'POST':
        form = LayoutForm(request.POST)
        windows = WindowFormSet(request.POST, prefix='windows')
        doors = DoorFormSet(request.POST, prefix='doors')
        if form.is_valid() and windows.is_valid() and doors.is_valid():
            layout = form.create(request)
            stories = form.cleaned_data['stories']
            windows.create(layout)
            doors.create(layout)
            names = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth']
            names = [n + ' Floor' for n in names]
            if stories > 2:
                names.insert(0, 'Basement')
            for (story, name) in enumerate(names[:stories]):
                Floor.objects.create(layout=layout, story=story, name=name)
            return redirect(layout)
    else:
        form = LayoutForm()
        windows = WindowFormSet(prefix='windows', queryset=Window.objects.none())
        doors = DoorFormSet(prefix='doors', queryset=Door.objects.none())
    return render(request, 'properties.hisp', {
        'form': form,
        'windows': windows,
        'doors': doors,
    })
       

@commit_on_success
@login_required
def properties(request, layout):
    from forms import UpdateLayoutForm as LayoutForm
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.method == 'POST':
        form = LayoutForm(request.POST, instance=layout)
        windows = WindowFormSet(request.POST, prefix='windows')
        doors = DoorFormSet(request.POST, prefix='doors')
        if form.is_valid() and windows.is_valid() and doors.is_valid():
            form.save()
            windows.save(layout)
            doors.save(layout)
            return redirect('users.views.home')
    else:
        form = LayoutForm(instance=layout)
        windows = WindowFormSet(prefix='windows', queryset=layout.windows.all())
        doors = DoorFormSet(prefix='doors', queryset=layout.doors.all())
    return render(request, 'properties.hisp', {
        'layout': layout,
        'form': form,
        'windows': windows,
        'doors': doors,
    })

@commit_on_success
@login_required
def duplicate(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.method == 'POST':
        form = LayoutForm(request.POST, instance=layout)
        if form.is_valid():
            raise 'wrong'
            new = form.save(commit=False)
            new.id = None
            new.save()
            return redirect(new)
    else:
        form = LayoutForm(instance=layout, initial={'name': layout.name + ' (copy)'})
    return render(request, 'duplicate.hisp', {'form': form})

@commit_on_success
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

@commit_on_success
@login_required
def outersave(request, layout):
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    if request.method != 'POST':
        raise Http404
    data = request.POST.get('data', '')
    perimiter = request.POST.get('perimiter', '')
    area = request.POST.get('area', '')
    try:
        perimiter = float(perimiter)
        area = float(area)
    except ValueError:
        raise Http404
    layout.outline = data
    layout.perimiter = perimiter
    layout.floor_area = area
    layout.save()
    return HttpResponse('true', mimetype='application/json')

@commit_on_success
@login_required
def innersave(request, layout, story):
    import json
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    floor = get_object_or_404(Floor, layout=layout, story=story)
    if request.method != 'POST':
        raise Http404
    data = request.POST.get('data', '')
    floor.json = data;
    floor.save()

    windows = json.loads(request.POST.get('windows', '{}'))
    for (wpk, info) in windows.items():
        window = get_object_or_404(layout.windows, pk=wpk)
        counter, _ = window.counts.get_or_create(floor=floor)
        try:
            counter.count = int(info['count'])
            counter.width = float(info['length'])
        except ValueError:
            raise Http404
        counter.save()

    doors = json.loads(request.POST.get('doors', '{}'))
    for (dpk, count) in doors.items():
        door = get_object_or_404(layout.doors, pk=dpk)
        counter, _ = door.counts.get_or_create(floor=floor)
        try:
            counter.count = int(count)
        except ValueError:
            raise Http404
        counter.save()

    return HttpResponse('true', mimetype='application/json')

@login_required
def outerjs(request, layout):
    from django.shortcuts import render_to_response
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    return render_to_response('layout.js', {
        'layout': layout,
        'save': reverse('layouts.views.outersave', args=[layout.pk]),
    }, mimetype='text/javascript')

@login_required
def innerjs(request, layout, story):
    from django.shortcuts import render_to_response
    layout = get_object_or_404(Layout, user=request.user, pk=layout)
    floor = get_object_or_404(Floor, layout=layout, story=story)
    return render_to_response('layout.js', {
        'floor': floor,
        'layout': layout,
        'save': reverse('layouts.views.innersave', args=[layout.pk, floor.story]),
    }, mimetype='text/javascript')
