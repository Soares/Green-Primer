from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from layouts.models import Layout
from layouts.forms import LayoutForm
from django.shortcuts import redirect
from django.http import Http404, HttpResponse
from utils import render

@login_required
def new(request):
    if request.method == 'POST':
        form = LayoutForm(request.POST)
        if form.is_valid():
            return redirect(form.create(request))
    else:
        form = LayoutForm()
    return render(request, 'new.hisp', {'form': form})

@login_required
def layout(request, pk):
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
    return render(request, 'layout.hisp', {'layout': layout})

@login_required
def properties(request, pk):
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
    if request.method == 'POST':
        form = LayoutForm(request.POST, instance=layout)
        if form.is_valid():
            form.save()
            return redirect('users.views.home')
    else:
        form = LayoutForm(instance=layout)
    return render(request, 'properties.hisp', {'form': form})

@login_required
def duplicate(request, pk):
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
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
def delete(request, pk):
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
    if request.POST.get('delete'):
        layout.delete()
    if request.method == 'POST':
        return redirect('users.views.home')
    return render(request, 'delete.hisp', {'layout': layout})

@login_required
def save(request, pk):
    print 'accesing', pk
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
    print 'method', request.method
    if request.method != 'POST':
        raise Http404
    data = request.POST.get('data', '')
    print 'data', data
    layout.json = data;
    layout.save()
    return HttpResponse('true')

@login_required
def js(request, pk):
    from django.shortcuts import render_to_response
    layout = get_object_or_404(Layout, user=request.user, pk=pk)
    return render_to_response('layout.js', {'layout': layout}, mimetype='text/javascript')
