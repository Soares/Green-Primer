from django.contrib.auth.decorators import login_required
from users.forms import LoginForm, RegistrationForm
from django.shortcuts import redirect
from utils import render

def main(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            form.login(request)
            return redirect('users.views.home')
    else:
        form = LoginForm()
    return render(request, 'main.hisp', {'form': form})

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.register(request)
            return redirect('users.views.home')
    else:
        form = RegistrationForm()
    return render(request, 'register.hisp', {'form': form})

@login_required
def home(request):
    return render(request, 'home.hisp', {
        'layouts': request.user.layouts.all(),
    })

@login_required
def logout(request):
    from django.contrib.auth import logout
    logout(request)
    return redirect('users.views.main')
