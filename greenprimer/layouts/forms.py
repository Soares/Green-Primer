from django import forms
from django.forms.formsets import formset_factory, BaseFormSet
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


class UpdateLayoutForm(forms.ModelForm):
    class Meta:
        model = Layout
        exclude = 'outline', 'user', 'stories'


class MultiFormSet(BaseFormSet):
    def create(self, layout):
        for form in self.forms:
            form.create(layout)

class WindowForm(forms.ModelForm):
    curtain = forms.BooleanField(label='Curtain Wall', required=False)

    class Meta:
        model = Window
        exclude = 'layout',

    def create(self, layout):
        window = self.save(commit=False)
        window.layout = layout
        window.save()
        return window
WindowFormSet = formset_factory(WindowForm, extra=3, max_num=3, formset=MultiFormSet)


class DoorForm(forms.ModelForm):
    class Meta:
        model = Door
        exclude = 'layout'

    def create(self, layout):
        window = self.save(commit=False)
        window.layout = layout
        window.save()
        return window
DoorFormSet = formset_factory(DoorForm, extra=3, max_num=3, formset=MultiFormSet)
