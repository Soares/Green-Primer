from django import forms
from django.forms.models import modelformset_factory, BaseModelFormSet
from layouts.models import Layout, Window, Door

class LayoutForm(forms.ModelForm):
    stories = forms.IntegerField(min_value=1, max_value=7, initial=2)

    class Meta:
        model = Layout
        exclude = 'outline', 'user', 'perimiter', 'floor_area'

    def create(self, request):
        layout = self.save(commit=False)
        layout.user = request.user
        layout.save()
        return layout


class UpdateLayoutForm(forms.ModelForm):
    class Meta:
        model = Layout
        exclude = 'outline', 'user', 'perimiter', 'floor_area'


class MultiFormSet(BaseModelFormSet):
    def create(self, layout):
        for form in self.forms:
            form.create(layout)

    def save(self, layout):
        for form in self.forms:
            model = form.save(commit=False)
            model.layout = layout
            if model.label:
                model.save()
            elif model.id:
                model.delete()


class WindowForm(forms.ModelForm):
    class Meta:
        model = Window
        exclude = 'layout', 'id'

    def create(self, layout):
        window = self.save(commit=False)
        window.layout = layout
        if window.label:
            window.save()
            return window
WindowFormSet = modelformset_factory(Window, WindowForm, extra=3, max_num=3, formset=MultiFormSet)


class DoorForm(forms.ModelForm):
    label = forms.CharField(max_length=50, required=False)

    class Meta:
        model = Door
        exclude = 'layout', 'id'

    def create(self, layout):
        window = self.save(commit=False)
        window.layout = layout
        window.save()
        return window
DoorFormSet = modelformset_factory(Door, DoorForm, extra=3, max_num=3, formset=MultiFormSet)
