from django import forms
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

class LoginForm(forms.Form):
    username = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        data = self.cleaned_data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            raise forms.ValidationError('Could not find user.')
        if not user.is_active:
            raise forms.ValidationError('User is inactive.')
        data['user'] = user
        return data

    def login(self, request):
        login(request, self.cleaned_data['user'])


class RegistrationForm(forms.Form):
    username = forms.EmailField(label='Email')
    password = forms.CharField(widget=forms.PasswordInput)
    confirm = forms.CharField('Password (Again)', widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('Username exists.')
        return username

    def clean_confirm(self):
        password = self.cleaned_data['password']
        passconf = self.cleaned_data['confirm']
        if passconf != password:
            raise forms.ValidationError('Paswords do not match.')
        return passconf

    def register(self, request):
        username = self.cleaned_data['username']
        password = self.cleaned_data['password']
        User.objects.create_user(username, username, password)
        user = authenticate(username=username, password=password)
        login(request, user)
