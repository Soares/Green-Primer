from django import forms
from django.forms.formsets import formset_factory
from layouts.models import Layout, Window, Door

class LayoutForm(forms.ModelForm):
    class Meta:
        model = Layout
        exclude = 'outline', 'user'

    def create(self, request):
        layout = self.save(commit=False)
        layout.user = request.user
        layout.save()
        return layout


class WindowForm(forms.ModelForm):
    class Meta:
        model = Window
        exclude = 'layout',

    def __init__(self, *args, **kwargs):
        super(WindowForm, self).__init__(*args, **kwargs)
        curtain = self.fields['curtain']
        curtain.label = 'Curtain Wall'

    def create(self, layout):
        window = self.save(commit=False)
        window.layout = layout
        window.save()
        return window
WindowFormSet = formset_factory(WindowForm, can_delete=True, extra=3, max_num=3)


class DoorForm(forms.ModelForm):
    class Meta:
        model = Door
        exclude = 'layout'

    def create(self, layout):
        window = self.save(commit=False)
        window.layout = layout
        window.save()
        return window
DoorFormSet = formset_factory(DoorForm, can_delete=True, extra=3, max_num=3)
